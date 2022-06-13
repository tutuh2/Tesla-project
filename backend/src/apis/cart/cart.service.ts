import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) {}
    async findAll({ currentUser }) {
        return await this.cartRepository.find({
            where: { user: { id: currentUser.id } },
            relations: ['user', 'product'],
        });
    }
    async findOne({
        currentUser,
        productId,
    }: {
        currentUser: ICurrentUser;
        productId: string;
    }) {
        return await this.cartRepository.findOne({
            where: {
                product: { id: productId },
                user: { id: currentUser.id },
            },
            relations: ['user', 'product'],
        });
    }

    async create({
        currentUser,
        productId,
    }: {
        currentUser: ICurrentUser;
        productId: string;
    }) {
        const cartCheck = await this.cartRepository.findOne({
            product: { id: productId },
            user: { id: currentUser.id },
        });

        if (!cartCheck) {
            const cart = await this.cartRepository.create({
                product: { id: productId },
                user: { id: currentUser.id },
                productCount: 1,
            });
            return await this.cartRepository.save(cart);
        }
        await this.cartRepository.update(cartCheck, {
            productCount: cartCheck.productCount + 1,
        });

        return await this.cartRepository.findOne({
            product: { id: productId },
            user: { id: currentUser.id },
        });
    }

    async delete({
        currentUser,
        productId,
    }: {
        currentUser: ICurrentUser;
        productId: string;
    }) {
        const result = await this.cartRepository.delete({
            product: { id: productId },
            user: { id: currentUser.id },
        });
        return result.affected ? true : false;
    }
}
