import { OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AuditLog } from "../types/audit_log/audit_log.entity";
import { AbilitySubjects } from "../casl/casl-ability.factory";
import { User } from "../types/user/user.entity";

export type AuditLogEntry = {
    displayText?: string;
    user?: User;
    subject?: Extract<AbilitySubjects, string>;
    id?: bigint;
    newValue?: any;
    oldValue?: any;
};

export class PrismaService extends PrismaClient implements OnModuleInit {
    user: any;
    accessLog: any;
    constructor() {
        super();
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    genAuditLog(entries: AuditLogEntry[]): Promise<AuditLog[]>;
    genAuditLog(entry: AuditLogEntry): Promise<AuditLog>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async genAuditLog(entry: AuditLogEntry[] | AuditLogEntry): Promise<AuditLog[] | AuditLog> {
        throw new Error("This method is implemented in prisma.module.ts. This error should never occur.");
    }
}
