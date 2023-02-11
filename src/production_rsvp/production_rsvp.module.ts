import { Module } from "@nestjs/common";
import { ProductionRSVPResolver } from "./production_rsvp.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [ProductionRSVPResolver],
    imports: [PrismaModule]
})
export class ProductionRSVPModule {}
