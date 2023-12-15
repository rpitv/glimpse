import { Module } from "@nestjs/common";
import { RoleResolver } from "./role.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [RoleResolver],
    imports: [PrismaModule]
})
export class RoleModule {}
