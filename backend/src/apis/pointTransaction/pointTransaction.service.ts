import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    PointTransaction,
    POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransactino.entity';
import { User } from '../users/entities/user.entity';
import { IamportService } from '../iamport/iamport.service';
import axios from 'axios';

@Injectable()
export class PointTransactionService {
    constructor(
        @InjectRepository(PointTransaction)
        private readonly pointTransactionRepository: Repository<PointTransaction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly iamportService: IamportService,
        private readonly connection: Connection,
    ) {}

    async create({ impUid, amount, currentUser }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();

        //transaction 시작!
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            const isValid = await this.iamportService.checkValidation({
                impUid,
                amount,
            });
            if (!isValid)
                throw new UnprocessableEntityException(
                    '유효하지 않은 결제 정보입니다.',
                );

            const isDouble = await this.iamportService.checkDouble({ impUid });
            if (isDouble) throw new ConflictException('중복 결제건 입니다.');

            // 1. pointTransaction 테이블에 거래기록 1줄 생성
            const pointTransaction =
                await this.pointTransactionRepository.create({
                    impUid: impUid,
                    amount: amount,
                    user: currentUser,
                    status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
                });
            await queryRunner.manager.save(pointTransaction);

            // 2. 유저의 돈 찾아오기
            const user = await queryRunner.manager.findOne(
                User,
                { id: currentUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );

            // 3. 유저의 돈 업데이트
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point + amount },
            // );
            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point + amount,
            });
            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();

            // 4. 최종결과 프론트엔드에 돌려주기
            return pointTransaction;
        } catch (error) {
            //롤백!
            await queryRunner.rollbackTransaction();
        } finally {
            //연결 해제
            await queryRunner.release();
        }
    }

    async cancel({ impUid, currentUser }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            //impUid로 기존 결제 데이터 검색
            const transaction = await queryRunner.manager.findOne(
                PointTransaction,
                { impUid: impUid },
                { lock: { mode: 'pessimistic_write' } },
            );

            // const transaction = await this.pointTransactionRepository.findOne({
            //     where: { impUid: impUid },
            // });

            //만약 cancelledAt 데이터가 null이 아니라면 이미 취소된 결제, 에러 반환
            if (transaction.cancelledAt)
                throw new UnprocessableEntityException(
                    '이미 취소된 결제입니다.',
                );

            const userInfo = await queryRunner.manager.findOne(
                User,
                { id: currentUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );
            // const userInfo = await this.userRepository.findOne({
            //     where: { id: currentUser.id },
            // });
            // console.log(userInfo);

            // 현재 보유한 포인트 확인. 모자랄경우 에러 반환
            if (userInfo.point < transaction.amount)
                throw new UnprocessableEntityException(
                    '환불할 포인트가 부족합니다.',
                );

            // 인증토큰 받아오기
            const getToken = await axios({
                url: 'https://api.iamport.kr/users/getToken',
                method: 'post', // POST method
                headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
                data: {
                    imp_key: 'Rest API 키', // REST API키
                    imp_secret:
                        'REST API Secret', // REST API Secret
                },
            });
            const { access_token } = getToken.data.response; // 인증토큰
            console.log(access_token);

            const getCancelData = await axios({
                url: 'https://api.iamport.kr/payments/cancel',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
                },
                data: {
                    reasos: '테스트', // 가맹점 클라이언트로부터 받은 환불사유
                    imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
                    amount: transaction.amount, // 가맹점 클라이언트로부터 받은 환불금액
                },
            });
            const { response } = getCancelData.data;
            if (!response) {
                throw new UnprocessableEntityException(
                    '이미 취소된 결제입니다.',
                );
            }

            // 기존에 있는 데이터 취소 날짜 적어주기
            // await this.pointTransactionRepository.update(
            //     { impUid: impUid },
            //     { cancelledAt: new Date() },
            // );
            const updatedTransaction = this.pointTransactionRepository.create({
                ...transaction,
                cancelledAt: new Date(),
            });
            await queryRunner.manager.save(updatedTransaction);

            // 새로운 포인트 결제 데이터 추가해주기
            // await this.pointTransactionRepository.save({
            //     impUid: impUid,
            //     amount: response.cancel_amount * -1,
            //     user: currentUser,
            //     status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
            // });
            const newTransaction = this.pointTransactionRepository.create({
                impUid: impUid,
                amount: response.cancel_amount * -1,
                user: currentUser,
                status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
            });
            await queryRunner.manager.save(newTransaction);
            await queryRunner.commitTransaction();

            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
