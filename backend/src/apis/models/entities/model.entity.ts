import { Field, Int, ObjectType, Float } from '@nestjs/graphql';
import {
    Column,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Model {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => String)
    model: string;

    @Column()
    @Field(() => String)
    detailedModel: string;

    @Column()
    @Field(() => Int)
    range: number;

    @Column()
    @Field(() => Int)
    speed: number;

    @Column()
    @Field(() => Float)
    zeroHundred: number;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => Int)
    seat: number;

    @Column()
    @Field(() => String)
    color: string;

    @Column()
    @Field(() => String)
    interior: string;

    @Column()
    @Field(() => String)
    wheelType: string;

    @Column()
    @Field(() => Boolean)
    autoPilotSystem: boolean;

    @Column()
    @Field(() => String)
    wheelDrive: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
