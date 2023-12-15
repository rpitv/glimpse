import { Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";
import { PrismaModule } from "../prisma/prisma.module";
import { RuleDirective } from "./rule.directive";
import { CaslPlugin } from "./casl.plugin";

@Module({
    providers: [CaslAbilityFactory, CaslHelper, RuleDirective, CaslPlugin],
    imports: [PrismaModule],
    exports: [CaslAbilityFactory, CaslHelper, RuleDirective, CaslPlugin]
})
export class CaslModule {}
