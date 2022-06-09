import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { Product } from './entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Cart } from '../cart/entities/cart.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductTag]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200',
        }),
    ],
    providers: [
        ProductResolver, //
        ProductService,
    ],
})
export class ProductModule {}
