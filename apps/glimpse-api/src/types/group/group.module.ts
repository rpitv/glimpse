import { Module } from "@nestjs/common";
import { GroupResolver } from "./group.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [GroupResolver],
    imports: [PrismaModule]
})
export class GroupModule {}
