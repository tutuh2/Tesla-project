import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/login/naver',
            scope: ['profile'],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
            email: profile.email,
            password: '1111',
            name: profile.name,
            age: 0,
        };
    }
}
