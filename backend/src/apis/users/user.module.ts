import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAcessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Cart } from '../cart/entities/cart.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Cart])],
    providers: [UserResolver, UserService, JwtAcessStrategy],
})
export class UserModule {}
