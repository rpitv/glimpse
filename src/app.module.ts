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
import { ContactSubmissionModule } from "./contact_submissions/contact_submission.module";
import { CreditModule } from "./credit/credit.module";
import { GroupPermissionModule } from "./group_permission/group_permission.module";
import { GroupModule } from "./group/group.module";
import { ImageModule } from "./image/image.module";
import { PersonModule } from "./person/person.module";
import { PersonImageModule } from "./person_image/person_image.module";
import { PersonRoleModule } from "./person_role/person_role.module";
import { ProductionImageModule } from "./production_image/production_image.module";
import { ProductionRSVPModule } from "./production_rsvp/production_rsvp.module";
import { ProductionTagModule } from "./production_tag/production_tag.module";
import { ProductionVideoModule } from "./production_video/production_video.module";
import { ProductionModule } from "./production/production.module";
import { RedirectModule } from "./redirect/redirect.module";
import { RoleModule } from "./role/role.module";
import { UserGroupModule } from "./user_group/user_group.module";
import { UserPermissionModule } from "./user_permission/user_permission.module";
import { VideoModule } from "./video/video.module";
import { VoteModule } from "./vote/vote.module";
import { VoteResponseModule } from "./vote_response/vote_response.module";
import { GraphQLRuleDirective, RuleDirective } from "./casl/rule.directive";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [CaslModule],
            inject: [RuleDirective],
            useFactory: async (ruleDirective: RuleDirective) => ({
                transformSchema: (schema) => ruleDirective.create(schema, "rule"),
                autoSchemaFile: path.join(process.cwd(), "generated/schema.gql"),
                sortSchema: true,
                playground: {
                    settings: {
                        "request.credentials": "include"
                    }
                },
                buildSchemaOptions: {
                    directives: [GraphQLRuleDirective]
                }
            })
        }),
        AccessLogModule,
        AlertLogModule,
        AssetModule,
        AuditLogModule,
        BlogPostModule,
        CategoryModule,
        ContactSubmissionModule,
        CreditModule,
        GroupModule,
        GroupPermissionModule,
        ImageModule,
        PersonModule,
        PersonImageModule,
        PersonRoleModule,
        ProductionImageModule,
        ProductionRSVPModule,
        ProductionTagModule,
        ProductionVideoModule,
        ProductionModule,
        RedirectModule,
        RoleModule,
        UserGroupModule,
        UserPermissionModule,
        UserModule,
        VideoModule,
        VoteModule,
        VoteResponseModule,
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
