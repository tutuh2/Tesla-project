import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelModule } from './apis/models/model.module';
import { ProductModule } from './apis/product/product.module';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { ProductImagesModule } from './apis/productImages/productImages.module';
import { FileModule } from './apis/file/file.module';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CartModule } from './apis/cart/cart.module';
import { BookingModule } from './apis/booking/booking.module';

@Module({
    imports: [
        AuthModule,
        FileModule,
        ProductModule,
        ModelModule,
        UserModule,
        ProductImagesModule,
        PointTransactionModule,
        CartModule,
        BookingModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/commons/graphql/schema.gql',
            context: ({ req, res }) => ({ req, res }),
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'my-database',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'mydocker02',
            entities: [__dirname + '/apis/**/*.entity.*'],
            synchronize: true,
            logging: true,
            retryAttempts: 50,
        }),
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: 'redis://my-redis:6379',
            isGlobal: true,
        }),
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule {}
