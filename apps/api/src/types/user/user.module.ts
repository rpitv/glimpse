import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { AuthModule } from "../../auth/auth.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { UserService } from "./user.service";

@Module({
    providers: [UserResolver, UserService],
    exports: [UserService],
    imports: [AuthModule, PrismaModule]
})
export class UserModule {}
