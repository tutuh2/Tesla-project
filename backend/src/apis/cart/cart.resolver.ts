import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Resolver()
export class CartResolver {
    constructor(
        private readonly cartService: CartService, //
    ) {}

    @Query(() => Cart)
    async fetchCart(@Args('cartId') cartId: string) {
        const cart = await this.cartService.findAll({ cartId });
        console.log(cart);
        return cart;
    }

    @Mutation(() => Cart)
    addProductToCart(
        @Args('cartId') cartId: string,
        @Args('productId') productId: string,
    ) {
        return this.cartService.addCart({ cartId, productId });
    }

    @Mutation(() => Cart)
    deleteProudctfromCart(
        @Args('cartId') cartId: string,
        @Args('productId') productId: string,
    ) {
        return this.cartService.deleteCart({ cartId, productId });
    }
}
