import { Module } from '@nestjs/common';
import {CaslAbilityFactory} from "./casl-ability.factory";
import {PrismaService} from "../prisma/prisma.service";

@Module({
    providers: [CaslAbilityFactory, PrismaService],
    exports: [CaslAbilityFactory]
})
export class CaslModule {}
