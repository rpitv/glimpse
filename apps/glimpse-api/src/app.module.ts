import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import * as path from 'path';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import { MainExceptionFilter } from './main.filter';
import { caslMiddleware } from './casl/casl.middleware';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import {RulesGuard} from "./casl/rules.guard";
import {CaslInterceptor} from "./casl/casl.interceptor";

/*

        if (context.getType<GqlContextType>() === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context)
            // this.logger.debug(JSON.stringify(gqlContext.getInfo()));
            // TODO permission checks
        }

        const httpContext = context.switchToHttp();


        const result = await firstValueFrom(next.handle())
        console.log(context.getType());
        console.log(result);
        // TODO permissions checks
        return result;

 */

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'generated/schema.gql'),
      sortSchema: true,
      playground: true,
      buildSchemaOptions: {
        fieldMiddleware: [caslMiddleware],
      },
    }),
    UserModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: MainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RulesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CaslInterceptor,
    },
  ],
})
export class AppModule {}
