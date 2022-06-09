import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENT_ID,
            callbackURL: 'http://localhost:3000/login/kakao',
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile._json.kakao_account.email);
        console.log(profile.username);
        return {
            email: profile._json.kakao_account.email,
            password: '1111',
            name: profile.username,
            age: 0,
        };
    }
}
