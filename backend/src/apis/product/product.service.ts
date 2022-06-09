import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductTag)
        private readonly productTagRepository: Repository<ProductTag>,
    ) {}

    async findAll() {
        const product = await this.productRepository.find({
            relations: ['productTag'],
        });
        return product;
    }

    async findAllDeleted() {
        return await this.productRepository.find({
            withDeleted: true,
        });
    }

    async findOne({ productId }) {
        return await this.productRepository.findOne({
            where: { id: productId },
            relations: ['productTag'],
        });
    }

    async create({ createProductInput }) {
        const { productTag, ...product } = createProductInput;
        const result = [];
        for (let i = 0; i < productTag.length; i++) {
            const tagname = productTag[i].replace('#', '');

            const prevTag = await this.productTagRepository.findOne({
                name: tagname,
            });

            if (prevTag) {
                result.push(prevTag);
            } else {
                const newTag = await this.productTagRepository.save({
                    name: tagname,
                });
                result.push(newTag);
            }
        }

        return await this.productRepository.save({
            ...product,
            productTag: result,
        });
    }

    async update({ productId, updateProductInput }) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        const newProduct = {
            ...product,
            ...updateProductInput,
        };

        return await this.productRepository.save(newProduct);
    }

    async delete({ productId }) {
        const result = await this.productRepository.softDelete({
            id: productId,
        });
        return result.affected ? true : false;
    }
}
