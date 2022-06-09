import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService, //
    ) {}
    
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [User])
    fetchUsers() {
        return this.userService.findAll();
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => User)
    fetchUser(@Args('email') email: string) {
        return this.userService.findOne({ email });
    }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args('age') age: number,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userService.create({
            email,
            hashedPassword,
            name,
            age,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    deleteUser(@Args('userId') userId: string) {
        return this.userService.delete({ userId });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => String)
    fetchTest(@CurrentUser() currentUser: any){
        console.log('currentUser는??', currentUser);
        console.log('fetchUser실행완료!!!')
    }
}
