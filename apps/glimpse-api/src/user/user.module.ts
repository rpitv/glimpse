import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [UserResolver],
    imports: [AuthModule, PrismaModule]
})
export class UserModule {}
