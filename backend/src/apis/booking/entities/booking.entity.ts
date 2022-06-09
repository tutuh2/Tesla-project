import { ObjectType, Field } from '@nestjs/graphql';
import { Model } from 'src/apis/models/entities/model.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @JoinColumn()
    @OneToOne(() => Model)
    @Field(() => Model)
    model: Model;

    @UpdateDateColumn()
    bookedAt: Date;

    @ManyToOne(() => Product)
    @Field(() => Product)
    product: Product;
}
