import { Module } from "@nestjs/common";
import { ImageResolver } from "./image.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    providers: [ImageResolver],
    imports: [PrismaModule, ConfigModule]
})
export class ImageModule {}
