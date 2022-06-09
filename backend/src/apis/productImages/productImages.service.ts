import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImages } from './entities/productImages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImagesService {
    constructor(
        @InjectRepository(ProductImages)
        private readonly productImagesRepository: Repository<ProductImages>,
    ) {}

    async findAll() {
        return await this.productImagesRepository.find({
            relations: ['product'],
        });
    }

    async findOne({ productId }) {
        return await this.productImagesRepository.findOne({
            where: { id: productId },
            relations: ['product'],
        });
    }

    async create({ createProductImagesInput }) {
        const { productId, ...productImages } = createProductImagesInput;
        return await this.productImagesRepository.save({
            ...productImages,
            product: { id: productId },
        });
    }

    async update({ productImagesId, updateProductImagesInput }) {
        const product = await this.productImagesRepository.findOne({
            where: { id: productImagesId },
        });

        const newProductImages = {
            ...product,
            ...updateProductImagesInput,
        };

        return await this.productImagesRepository.save(newProductImages);
    }

    async delete({ productImagesId }) {
        const result = await this.productImagesRepository.softDelete({
            id: productImagesId,
        });
        return result.affected ? true : false;
    }

    // 1번 로직
    // 1. 클라이언트에서 상품의 id와 해당하는 상품에 들어갈 모든 이미지 url 목록을 보내줍니다.
    // 2. 이미지 테이블에서 상품 id가 일치하는 데이터를 모두 삭제합니다.
    // 3. 새로운 이미지 url을 가지고 데이터를 생성합니다.
    // 4. 즉, 기존 데이터를 수정하는게 아니라,
    //     상품 ID에 해당하는 기존 데이터를 전부 삭제하고 → 새로 전부 생성합니다.
    async add1({ addProductImagesInput }) {
        const { productId, ...imageList } = addProductImagesInput;
        console.log(productId, imageList);
        await this.productImagesRepository.softDelete({
            product: { id: addProductImagesInput.productId },
        });
        const results = await Promise.all(
            imageList.imageUrl.map((el) => {
                console.log(el);
                return this.productImagesRepository.save({
                    product: { id: productId },
                    imageUrl: el,
                });
            }),
        );
        console.log(results);
        return results;
    }

    // 로직2
    // 1. 상품 ID에 해당하는 모든 이미지 데이터를 찾아옵니다.
    // 2. 이미 테이블에 있는 이미지면 유지합니다.
    // 3. 기존에 없는 이미지면서 클라이언트가 보내준 이미지면 데이터를 새로 생성합니다.
    // 4. 해당 안되는 기존 이미지는 제거합니다.
    async add2({ addProductImagesInput }) {
        const { productId, ...imageList } = addProductImagesInput;
        const dbImageList = await this.productImagesRepository.find({
            where: { product: { id: productId } },
        });

        const dbImageList2 = dbImageList.map((el) => el.imageUrl);
        console.log(dbImageList2);
        console.log(imageList.imageUrl);

        // 새로 추가된 이미지가 아닐경우 삭제.
        const result = await Promise.all(
            dbImageList2.map((el) => {
                if (!imageList.imageUrl.includes(el)) {
                    return this.productImagesRepository.softDelete({
                        product: { id: productId },
                        imageUrl: el,
                    });
                }
                return;
            }),
        );

        // db에 저장되지 않은 이미지일 경우 db에 저장
        const result2 = await Promise.all(
            imageList.imageUrl.map(async (el) => {
                let checker = await this.productImagesRepository.find({
                    where: { product: { id: productId }, imageUrl: el },
                });
                console.log(checker.length, 'this is checker');
                if (!checker.length) {
                    return this.productImagesRepository.save({
                        product: { id: productId },
                        imageUrl: el,
                    });
                }
                return;
            }),
        );

        console.log(result2);
        //undefined 거르기
        const result3 = result2.filter((el) => el !== undefined);
        console.log(result3);
        return result3;
    }
}
