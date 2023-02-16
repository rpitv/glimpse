import { Module } from "@nestjs/common";
import { UserPermissionResolver } from "./user_permission.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { CaslModule } from "../../casl/casl.module";

@Module({
    providers: [UserPermissionResolver],
    imports: [PrismaModule, CaslModule]
})
export class UserPermissionModule {}
