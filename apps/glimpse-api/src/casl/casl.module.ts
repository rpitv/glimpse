import { Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
    providers: [CaslAbilityFactory, CaslHelper],
    imports: [PrismaModule],
    exports: [CaslAbilityFactory, CaslHelper]
})
export class CaslModule {}
