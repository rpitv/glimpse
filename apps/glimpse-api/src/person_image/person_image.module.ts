import { Module } from "@nestjs/common";
import { PersonImageResolver } from "./person_image.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [PersonImageResolver],
    imports: [PrismaModule]
})
export class PersonImageModule {}
