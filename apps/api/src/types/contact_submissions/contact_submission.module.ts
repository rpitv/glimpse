import { Module } from "@nestjs/common";
import { ContactSubmissionResolver } from "./contact_submission.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    providers: [ContactSubmissionResolver],
    imports: [PrismaModule, ConfigModule],
})
export class ContactSubmissionModule {}
