import { Module } from "@nestjs/common";
import { UserGroupResolver } from "./user_group.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [UserGroupResolver],
    imports: [PrismaModule]
})
export class UserGroupModule {}
