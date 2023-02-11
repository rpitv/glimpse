import { Module } from "@nestjs/common";
import { ProductionImageResolver } from "./production_image.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [ProductionImageResolver],
    imports: [PrismaModule]
})
export class ProductionImageModule {}
