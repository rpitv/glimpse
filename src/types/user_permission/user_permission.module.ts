import { Module } from "@nestjs/common";
import { UserPermissionResolver } from "./user_permission.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [UserPermissionResolver],
    imports: [PrismaModule]
})
export class UserPermissionModule {}
