import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) {}

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne({ email }) {
        return await this.userRepository.findOne({
            where: { email: email },
        });
    }

    async create({ email, hashedPassword: password, name, age }) {
        const user = await this.userRepository.findOne({ email });
        if (user) throw new ConflictException('이미 등록된 이메일 입니다.');
        const product = [];
        const cart = await this.cartRepository.save({
            product,
        });
        console.log(cart);

        return this.userRepository.save({ email, password, name, age, cart });
    }

    async delete({ userId }) {
        const result = await this.userRepository.softDelete({
            id: userId,
        });
        return result.affected ? true : false;
    }
}
