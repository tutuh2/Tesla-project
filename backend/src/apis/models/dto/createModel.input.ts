import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateModelInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    model: string;

    @Field(() => String)
    detailedModel: string;

    @Field(() => Int)
    range: number;

    @Field(() => Int)
    speed: number;

    @Field(() => Float)
    zeroHundred: number;

    @Field(() => Int)
    price: number;

    @Field(() => Int)
    seat: number;

    @Field(() => String)
    color: string;

    @Field(() => String)
    interior: string;

    @Field(() => String)
    wheelType: string;

    @Field(()=> Boolean)
    autoPilotSystem: boolean;

    @Field(() => String)
    wheelDrive: string;
}
