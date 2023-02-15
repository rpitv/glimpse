import { Module } from "@nestjs/common";
import { StreamResolver } from "./stream.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [StreamResolver],
    imports: [PrismaModule]
})
export class StreamModule {}
