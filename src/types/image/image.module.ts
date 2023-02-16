import { Module } from "@nestjs/common";
import { ImageResolver } from "./image.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [ImageResolver],
    imports: [PrismaModule]
})
export class ImageModule {}
