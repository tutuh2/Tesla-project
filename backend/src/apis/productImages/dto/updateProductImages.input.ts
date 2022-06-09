import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductImagesInput } from './createProductImages.input';

@InputType()
export class UpdateProductImagesInput extends PartialType(
    CreateProductImagesInput,
) {}
