import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImages } from './entities/productImages.entity';
import { ProductImagesResolver } from './productImages.resolver';
import { ProductImagesService } from './productImages.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductImages])],
    providers: [
        ProductImagesResolver, //
        ProductImagesService,
    ],
})
export class ProductImagesModule {}
