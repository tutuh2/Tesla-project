import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddProductImagesInput {
    @Field(() => String)
    productId: string;

    @Field(() => [String])
    imageUrl: string[];
}
