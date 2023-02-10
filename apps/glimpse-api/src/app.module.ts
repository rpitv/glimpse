import { Module } from "@nestjs/common";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UserModule } from "./user/user.module";
import * as path from "path";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MainExceptionFilter } from "./main.filter";
import { AuthModule } from "./auth/auth.module";
import { CaslModule } from "./casl/casl.module";
import { CaslInterceptor } from "./casl/casl.interceptor";
import { CaseSensitivity } from "./generic/case-sensitivity.enum";
import { OrderDirection } from "./generic/order-direction.enum";
import { ComplexityPlugin } from "./gql-complexity.plugin";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaInterceptor } from "./prisma/prisma.interceptor";
import { AccessLogModule } from "./access_log/access_log.module";
import { AlertLogModule } from "./alert_log/alert_log.module";
import { AssetModule } from "./asset/asset.module";
import { AuditLogModule } from "./audit_log/audit_log.module";
import { BlogPostModule } from "./blog_post/blog_post.module";
import { CategoryModule } from "./category/category.module";
import {ContactSubmissionModule} from "./contact_submissions/contact_submission.module";

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
            }
        }),
        AccessLogModule,
        AlertLogModule,
        AssetModule,
        AuditLogModule,
        BlogPostModule,
        CategoryModule,
        ContactSubmissionModule,
        UserModule,
        AuthModule,
        CaslModule,
        PrismaModule
    ],
    controllers: [],
    providers: [
        ComplexityPlugin,
        {
            provide: APP_FILTER,
            useClass: MainExceptionFilter
        },
        {
            // IMPORTANT! PrismaInterceptor must be registered before any other interceptors which use req.prismaTx.
            provide: APP_INTERCEPTOR,
            useClass: PrismaInterceptor
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
