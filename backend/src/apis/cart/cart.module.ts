import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Cart, //
            Product,
        ]),
    ],
    providers: [
        CartResolver, //
        CartService,
    ],
})
export class CartModule {}
