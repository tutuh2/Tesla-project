import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService: CartService, //
    ) {}

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Cart])
    fetchCarts(@CurrentUser() currentUser: ICurrentUser) {
        return this.cartService.findAll({ currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Cart)
    fetchCart(
        @Args('productId') productId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.cartService.findOne({ currentUser, productId });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Cart)
    async createCart(
        @Args('productId') productId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.cartService.create({
            currentUser,
            productId,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteCart(
        @Args('productId') productId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.cartService.delete({
            currentUser,
            productId,
        });
    }
}
