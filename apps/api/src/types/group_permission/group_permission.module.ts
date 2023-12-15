import { Module } from "@nestjs/common";
import { GroupPermissionResolver } from "./group_permission.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [GroupPermissionResolver],
    imports: [PrismaModule]
})
export class GroupPermissionModule {}
