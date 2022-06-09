import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductImagesInput {
    @Field(() => String)
    productId: string;

    @Field(() => String)
    imageUrl: string;
}
