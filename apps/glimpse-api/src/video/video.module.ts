import { Module } from "@nestjs/common";
import { VideoResolver } from "./video.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [VideoResolver],
    imports: [PrismaModule]
})
export class VideoModule {}
