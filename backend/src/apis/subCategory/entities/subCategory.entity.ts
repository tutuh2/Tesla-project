import { Field } from '@nestjs/graphql';
import { MainCategory } from 'src/apis/mainCategory/entities/mainCategory.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => MainCategory)
    mainCategory: MainCategory;

    @ManyToMany(() => Product, (product) => product.subCategory)
    product: Product[];
}
