import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, User, Product])],
    providers: [CartResolver, CartService],
})
export class CartModule {}
