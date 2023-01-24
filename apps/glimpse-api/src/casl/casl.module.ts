import { Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { PrismaService } from "../prisma/prisma.service";
import { CaslHelper } from "./casl.helper";

@Module({
    providers: [CaslAbilityFactory, PrismaService, CaslHelper],
    exports: [CaslAbilityFactory, CaslHelper]
})
export class CaslModule {}
