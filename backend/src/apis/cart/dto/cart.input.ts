import { InputType, OmitType } from '@nestjs/graphql';
import { Cart } from '../entities/cart.entity';

@InputType()
export class CartInput extends OmitType(Cart, ['id'], InputType) {
    //
}
