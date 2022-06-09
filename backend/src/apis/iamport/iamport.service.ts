import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { PointTransaction } from '../pointTransaction/entities/pointTransactino.entity';

@Injectable()
export class IamportService {
    constructor(
        @InjectRepository(PointTransaction)
        private readonly pointTransactionRepository: Repository<PointTransaction>,
    ) {}
    async checkValidation({ impUid, amount }) {
        const getToken = await axios({
            url: 'https://api.iamport.kr/users/getToken',
            method: 'post', // POST method
            headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
            data: {
                imp_key: '3454683916871491', // REST API키
                imp_secret:
                    'ef2ac41ef1b9a9d8069a88c23d7d4e9e902f7ae14f1a3d9b9f60ad283af70f643b36f04ca76003e2', // REST API Secret
            },
        });
        const { access_token } = getToken.data.response; // 인증토큰
        console.log(access_token);

        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${impUid}`,
            method: 'get',
            headers: { Authorization: access_token },
        });
        const paymentData = getPaymentData.data.response;
        if (!paymentData || paymentData.amount !== amount) {
            return false;
        }

        return true;

        // if (!paymentData || paymentData.amount !== amount) {
        //     throw new UnprocessableEntityException(
        //         '유효하지 않은 결제 정보입니다.',
        //     );
        // }
    }

    async checkDouble({ impUid }) {
        const isDouble = await this.pointTransactionRepository.findOne({
            impUid,
        });

        if (isDouble) {
            return true;
        }

        return false;
        // if (isDouble) {
        //     throw new ConflictException('중복 결제건입니다.');
        // }
    }
}
