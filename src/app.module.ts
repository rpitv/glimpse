import { Module } from "@nestjs/common";
import { GraphQLModule, registerEnumType } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UserModule } from "./types/user/user.module";
import * as path from "path";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MainExceptionFilter } from "./main.filter";
import { AuthModule } from "./auth/auth.module";
import { CaslModule } from "./casl/casl.module";
import { CaslInterceptor } from "./casl/casl.interceptor";
import { CaseSensitivity } from "./gql/case-sensitivity.enum";
import { OrderDirection } from "./gql/order-direction.enum";
import { ComplexityPlugin } from "./gql/gql-complexity.plugin";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaInterceptor } from "./prisma/prisma.interceptor";
import { AccessLogModule } from "./types/access_log/access_log.module";
import { AlertLogModule } from "./types/alert_log/alert_log.module";
import { AssetModule } from "./types/asset/asset.module";
import { AuditLogModule } from "./types/audit_log/audit_log.module";
import { BlogPostModule } from "./types/blog_post/blog_post.module";
import { CategoryModule } from "./types/category/category.module";
import { ContactSubmissionModule } from "./types/contact_submissions/contact_submission.module";
import { CreditModule } from "./types/credit/credit.module";
import { GroupPermissionModule } from "./types/group_permission/group_permission.module";
import { GroupModule } from "./types/group/group.module";
import { ImageModule } from "./types/image/image.module";
import { PersonModule } from "./types/person/person.module";
import { PersonImageModule } from "./types/person_image/person_image.module";
import { PersonRoleModule } from "./types/person_role/person_role.module";
import { ProductionImageModule } from "./types/production_image/production_image.module";
import { ProductionRSVPModule } from "./types/production_rsvp/production_rsvp.module";
import { ProductionTagModule } from "./types/production_tag/production_tag.module";
import { ProductionVideoModule } from "./types/production_video/production_video.module";
import { ProductionModule } from "./types/production/production.module";
import { RedirectModule } from "./types/redirect/redirect.module";
import { RoleModule } from "./types/role/role.module";
import { UserGroupModule } from "./types/user_group/user_group.module";
import { UserPermissionModule } from "./types/user_permission/user_permission.module";
import { VideoModule } from "./types/video/video.module";
import { VoteModule } from "./types/vote/vote.module";
import { VoteResponseModule } from "./types/vote_response/vote_response.module";
import { GraphQLCustomRuleDirective, GraphQLRuleDirective, RuleDirective } from "./casl/rule.directive";
import {StreamModule} from "./types/stream/stream.module";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [CaslModule],
            inject: [RuleDirective],
            useFactory: async (ruleDirective: RuleDirective) => ({
                transformSchema: (schema) =>
                    ruleDirective.createCustom(ruleDirective.createBasic(schema, "rule"), "custom_rule"),
                autoSchemaFile: path.join(process.cwd(), "generated/schema.gql"),
                sortSchema: true,
                playground: {
                    settings: {
                        "request.credentials": "include"
                    }
                },
                buildSchemaOptions: {
                    directives: [GraphQLRuleDirective, GraphQLCustomRuleDirective]
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
        StreamModule,
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
