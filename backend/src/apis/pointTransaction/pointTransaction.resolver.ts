import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { PointTransaction } from './entities/pointTransactino.entity';
import { PointTransactionService } from './pointTransaction.service';

@Resolver()
export class PointTransactionResolver {
    constructor(
        private readonly pointTransactionService: PointTransactionService,
    ) {}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => PointTransaction)
    async createPointTransaction(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.pointTransactionService.create({
            impUid,
            amount,
            currentUser,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async cancelPointTransaction(
        @Args('impUid') impUid: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.pointTransactionService.cancel({
            impUid,
            currentUser,
        });
    }
}
