import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from 'src/apis/cart/entities/cart.entity';
import { ProductTag } from 'src/apis/productTag/entities/productTag.entity';
import { SubCategory } from 'src/apis/subCategory/entities/subCategory.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => String)
    description: string;

    @Column()
    @Field(() => Date)
    date: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @JoinTable()
    @ManyToMany(() => SubCategory, (subCategory) => subCategory.product)
    subCategory: SubCategory[];

    @JoinTable()
    @ManyToMany(() => ProductTag, (productTag) => productTag.product)
    @Field(() => [ProductTag])
    productTag: ProductTag[];

    @ManyToMany(() => Cart, (cart) => cart.product)
    @Field(() => [Cart])
    cart: Cart[];
}
