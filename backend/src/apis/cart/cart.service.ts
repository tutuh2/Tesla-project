import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async findAll({ cartId }) {
        const products = await this.cartRepository.findOne(
            {
                id: cartId,
            },
            { relations: ['product'] },
        );
        console.log(products);
        return products;
    }

    async addCart({ cartId, productId }) {
        const product = await this.productRepository.findOne({ id: productId });
        console.log(product);
        const cart = await this.cartRepository.findOne(
            { id: cartId },
            { relations: ['product'] },
        );
        const prevSavedItems = cart.product;
        console.log(prevSavedItems, '=========================');
        console.log(cart);
        const productList = [...prevSavedItems, product];
        console.log(productList);
        return await this.cartRepository.save({
            id: cart.id,
            product: productList,
        });
    }

    async deleteCart({ cartId, productId }) {
        const cart = await this.cartRepository.findOne(
            { id: cartId },
            { relations: ['product'] },
        );
        const savedItems = cart.product;
        const updated = savedItems.filter((el) => el.id !== productId);
        console.log(updated);
        return this.cartRepository.save({
            id: cartId,
            product: updated,
        });
    }
}
