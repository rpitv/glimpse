import { Module } from "@nestjs/common";
import { ContactSubmissionResolver } from "./contact_submission.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [ContactSubmissionResolver],
    imports: [PrismaModule]
})
export class ContactSubmissionModule {}
