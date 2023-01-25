import { Module } from "@nestjs/common";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UserModule } from "./user/user.module";
import { PrismaService } from "./prisma/prisma.service";
import * as path from "path";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MainExceptionFilter } from "./main.filter";
import { caslMiddleware } from "./casl/casl.middleware";
import { AuthModule } from "./auth/auth.module";
import { CaslModule } from "./casl/casl.module";
import { CaslInterceptor } from "./casl/casl.interceptor";
import { CaseSensitivity } from "./generic/case-sensitivity.enum";
import { OrderDirection } from "./generic/order-direction.enum";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: path.join(process.cwd(), "generated/schema.gql"),
            sortSchema: true,
            playground: {
                settings: {
                    "request.credentials": "include"
                }
            },
            buildSchemaOptions: {
                fieldMiddleware: [caslMiddleware]
            }
        }),
        UserModule,
        AuthModule,
        CaslModule
    ],
    controllers: [],
    providers: [
        PrismaService,
        {
            provide: APP_FILTER,
            useClass: MainExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CaslInterceptor
        }
    ]
})
export class AppModule {}

registerEnumType(CaseSensitivity, {
    name: "CaseSensitivity"
});
registerEnumType(OrderDirection, {
    name: "OrderDirection"
});
