import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import * as path from "path";
import {APP_FILTER} from "@nestjs/core";
import {GraphQLExceptionFilter} from "./graphql.filter";
import {loggerMiddleware} from "./graphql-permissions.middleware";

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
              fieldMiddleware: [loggerMiddleware]
          }
      }),
      UserModule,
  ],
  controllers: [],
  providers: [PrismaService, {
      provide: APP_FILTER,
      useClass: GraphQLExceptionFilter
  }],
})
export class AppModule {}
