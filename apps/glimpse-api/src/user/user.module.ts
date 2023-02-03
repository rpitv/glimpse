import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [UserResolver, PrismaService],
    imports: [AuthModule]
})
export class UserModule {}
