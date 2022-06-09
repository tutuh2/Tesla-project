import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    setRefreshToken({ user, res }) {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'myRefreshKey', expiresIn: '1w' },
        );

        // 개발환경
        res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

        // 배포환경
        // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
        // res.setHeader(
        //   'Set-Cookie',
        //   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`
        // )
    }

    getAccessToken({ user }) {
        return this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'myAccessKey', expiresIn: '1h' },
        );
    }

    async login(req, res) {
        let user = await this.userService.findOne({ email: req.user.email });
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                hashedPassword: req.user.password,
                name: req.user.name,
                age: req.user.age,
            });
        }
        this.setRefreshToken({ user, res });
        res.redirect(
            'http://localhost:5500/homework/day23/frontend/login/index.html',
        );
    }
}
