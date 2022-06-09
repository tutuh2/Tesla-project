import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @JoinTable()
    @ManyToMany(() => Product, (product) => product.cart)
    @Field(() => [Product])
    product: Product[];
}
