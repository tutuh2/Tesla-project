import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Cache } from 'cache-manager';

@Resolver()
export class ProductResolver {
    constructor(
        private readonly productService: ProductService, //
        private readonly elasticsearchService: ElasticsearchService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    @Query(() => [Product])
    async fetchProducts(@Args('keyword') keyword: string) {
        console.time('redis');
        const productCache = await this.cacheManager.get(keyword);
        console.log('=================================');
        console.log(productCache);
        console.log('=================================');
        if (productCache) {
            console.timeEnd('redis');
            return productCache;
        }
        // elasticsearch 에서 모든 정보를 못받아옴. M:N 테이블 정보를 받아올수가 없음.
        // 쿼리문을 바꿔야 할것같은데 잘 모르겠음.
        console.time('elastic');
        console.log('시작!');
        const result = await this.elasticsearchService.search({
            index: 'myproduct',
            query: {
                match: { name: keyword },
            },
        });
        console.timeEnd('elastic');
        console.log(result.hits.hits);
        console.log('끝');
        // 배열로 mysql에서 들고오려면 검색이 너무 느려짐. 이거 어떻게 해야할까.
        console.time('mysql');
        const search = result.hits.hits.map((ele) => {
            const productId = ele._source['id'];
            return this.productService.findOne({ productId });
        });

        const searchResult = await Promise.all(search);
        console.timeEnd('mysql');
        // console.log(searchResult);
        await this.cacheManager.set(keyword, searchResult, {
            ttl: 60,
        });
        // console.log(await this.cacheManager.get(keyword));
        return searchResult;
    }

    @Query(() => [Product])
    fetchProductsDeleted() {
        return this.productService.findAllDeleted();
    }

    @Query(() => Product)
    fetchProduct(
        @Args('productId') productId: string, //
    ) {
        return this.productService.findOne({ productId });
    }

    @Mutation(() => Product)
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput,
    ) {
        return this.productService.create({ createProductInput });
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args('productId') productId: string,
        @Args('updateProductInput') updateProductInput: UpdateProductInput,
    ) {
        return await this.productService.update({
            productId,
            updateProductInput,
        });
    }

    @Mutation(() => Boolean)
    deleteProduct(@Args('productId') productId: string) {
        return this.productService.delete({ productId });
    }
}
