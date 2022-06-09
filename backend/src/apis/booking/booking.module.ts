import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product, //
        ]),
    ],
    providers: [],
})
export class BookingModule {}
