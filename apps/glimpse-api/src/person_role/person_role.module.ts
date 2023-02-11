import { Module } from "@nestjs/common";
import { PersonRoleResolver } from "./person_role.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [PersonRoleResolver],
    imports: [PrismaModule]
})
export class PersonRoleModule {}
