import { Module } from "@nestjs/common";
import { RedirectResolver } from "./redirect.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [RedirectResolver],
    imports: [PrismaModule]
})
export class RedirectModule {}
