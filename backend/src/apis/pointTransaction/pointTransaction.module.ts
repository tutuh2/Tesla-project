import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entities/user.entity';
import { PointTransaction } from './entities/pointTransactino.entity';
import { PointTransactionResolver } from './pointTransaction.resolver';
import { PointTransactionService } from './pointTransaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([PointTransaction, User])],
    providers: [
        PointTransactionResolver,
        PointTransactionService,
        IamportService,
    ],
})
export class PointTransactionModule {}
