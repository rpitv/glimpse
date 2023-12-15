import { Module } from "@nestjs/common";
import { VoteResponseResolver } from "./vote_response.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [VoteResponseResolver],
    imports: [PrismaModule]
})
export class VoteResponseModule {}
