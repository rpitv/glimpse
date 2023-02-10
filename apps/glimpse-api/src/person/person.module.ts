import { Module } from "@nestjs/common";
import { PersonResolver } from "./person.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [PersonResolver],
    imports: [PrismaModule]
})
export class PersonModule {}
