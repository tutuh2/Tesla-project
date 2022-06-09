import { InputType, PartialType } from '@nestjs/graphql';
import { CreateModelInput } from './createModel.input';

@InputType()
export class UpdateModelInput extends PartialType(CreateModelInput) {}
