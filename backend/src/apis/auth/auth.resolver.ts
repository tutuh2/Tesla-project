import {
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
    GqlAuthAccessGuard,
    GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService, //
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}
    @Mutation(() => String)
    async login(
        @Args('email') email: string, //
        @Args('password') password: string,
        @Context() context: any,
    ) {
        // 1. 로그인(이메일과 비밀번호가 일치하는 유저찾기)
        const user = await this.userService.findOne({ email });

        // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
        if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

        // 3. 일치하는 유저가 있지만 암호가 틀렸다면? 에러던지기
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new UnprocessableEntityException('암호가 틀렸습니다.');

        //
        this.authService.setRefreshToken({ user, res: context.res });

        // 4. 일치하는 유저가 있으면?! accessToken(= JWT)을 만들어서 프론트엔드에 주기
        return this.authService.getAccessToken({ user });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    async logout(
        @Context() context: any, //
    ) {
        const accessToken = context.req.headers.authorization.replace(
            'Bearer ',
            '',
        );
        const accessValid = this.jwtService.verify(accessToken, {
            secret: 'myAccessKey',
        });
        console.log(accessToken);

        const refreshToken = context.req.headers.cookie.replace(
            'refreshToken=',
            '',
        );

        const refreshValid = this.jwtService.verify(refreshToken, {
            secret: 'myRefreshKey',
        });

        console.log(refreshToken);
        console.log(refreshValid);
        const isValid = this.userService.findOne({ email: accessValid.email });
        let nowTime = Math.floor(new Date().getTime() / 1000);
        let accessDuration = accessValid.exp - nowTime;
        let refreshDuration = refreshValid.exp - nowTime;
        console.log(accessDuration, refreshDuration);

        try {
            if (accessValid.sub === refreshValid.sub && isValid) {
                const accessCache = await this.cacheManager.set(
                    `accessToken:${accessToken}`,
                    `accessToken`,
                    {
                        ttl: accessDuration,
                    },
                );
                console.log(await this.cacheManager.get('accessToken'));
                const refreshCache = await this.cacheManager.set(
                    `refreshToken:${refreshToken}`,
                    `refreshToken`,
                    {
                        ttl: refreshDuration,
                    },
                );
                console.log(await this.cacheManager.get('refreshToken'));
            } else {
                throw new UnauthorizedException('다시 로그 해주십시오');
            }
        } catch (e) {}

        return 'Log off';
    }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(
        @CurrentUser() currentUser: ICurrentUser, //
    ) {
        return this.authService.getAccessToken({ user: currentUser });
    }
}
