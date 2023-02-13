import { Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";
import { PrismaModule } from "../prisma/prisma.module";
import {RuleDirective} from "./rule.directive";

@Module({
    providers: [CaslAbilityFactory, CaslHelper, RuleDirective],
    imports: [PrismaModule],
    exports: [CaslAbilityFactory, CaslHelper, RuleDirective]
})
export class CaslModule {}
