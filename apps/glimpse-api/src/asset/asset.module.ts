import { Module } from "@nestjs/common";
import { AssetResolver } from "./asset.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [AssetResolver],
    imports: [PrismaModule]
})
export class AssetModule {}
