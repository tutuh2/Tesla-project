import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: (req) =>
                req.headers.cookie.replace('refreshToken=', ''),
            secretOrKey: 'myRefreshKey',
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const userSentRefresh = req.headers.cookie.replace('refreshToken=', '');
        const checkLogout = await this.cacheManager.get(
            `refreshToken:${userSentRefresh}`,
        );
        console.log(checkLogout, 'refresh');
        if (checkLogout === 'refreshToken') {
            throw new UnauthorizedException('다시 로그인 해주십시오');
        }
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
