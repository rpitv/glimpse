import { Module } from "@nestjs/common";
import { VoteResolver } from "./vote.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [VoteResolver],
    imports: [PrismaModule]
})
export class VoteModule {}
