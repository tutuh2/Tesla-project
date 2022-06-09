import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class JwtAcessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'myAccessKey',
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const userSentAccess = req.headers.authorization.replace('Bearer ', '');
        const checkLogout = await this.cacheManager.get(
            `accessToken:${userSentAccess}`,
        );
        console.log(checkLogout, 'access');

        if (checkLogout === 'accessToken') {
            throw new UnauthorizedException('다시 로그인 해주십시오');
        }
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
