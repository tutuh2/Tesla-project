import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddProductImagesInput } from './dto/addProductImages.input';
import { CreateProductImagesInput } from './dto/createProductImages.input';
import { UpdateProductImagesInput } from './dto/updateProductImages.input';
import { ProductImages } from './entities/productImages.entity';
import { ProductImagesService } from './productImages.service';

@Resolver()
export class ProductImagesResolver {
    constructor(private readonly productImagesService: ProductImagesService) {}

    @Query(() => [ProductImages])
    fetchProductImages() {
        return this.productImagesService.findAll();
    }

    @Mutation(() => ProductImages)
    createProductImages(
        @Args('createProductImagesInput')
        createProductImagesInput: CreateProductImagesInput,
    ) {
        return this.productImagesService.create({ createProductImagesInput });
    }

    @Mutation(() => ProductImages)
    async updateProductImages(
        @Args('productImagesId') productImagesId: string,
        @Args('updateProductImagesInput')
        updateProductImagesInput: UpdateProductImagesInput,
    ) {
        return await this.productImagesService.update({
            productImagesId,
            updateProductImagesInput,
        });
    }

    @Mutation(() => Boolean)
    deleteProductImages(@Args('productImagesId') productImagesId: string) {
        return this.productImagesService.delete({ productImagesId });
    }

    @Mutation(() => [ProductImages])
    add1(
        @Args('addProductImages') addProductImagesInput: AddProductImagesInput
    ){
        return this.productImagesService.add1({addProductImagesInput});
    }

    @Mutation(() => [ProductImages])
    add2(
        @Args('addProductImages') addProductImagesInput: AddProductImagesInput,
    ) {
        return this.productImagesService.add2({ addProductImagesInput });
    }
}
