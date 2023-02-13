import { Module } from "@nestjs/common";
import { CreditResolver } from "./credit.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [CreditResolver],
    imports: [PrismaModule]
})
export class CreditModule {}
