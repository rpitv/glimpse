import { Module } from "@nestjs/common";
import { ProductionVideoResolver } from "./production_video.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [ProductionVideoResolver],
    imports: [PrismaModule]
})
export class ProductionVideoModule {}
