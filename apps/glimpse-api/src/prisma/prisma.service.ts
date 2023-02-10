import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Prisma, PrismaPromise, UnwrapTuple } from ".prisma/client";
import { Request } from "express";
import { AuditLog } from "../audit_log/audit_log.entity";
import { AbilitySubjects } from "../casl/casl-ability.factory";
import { User } from "../user/user.entity";

export type AuditLogEntry = {
    displayText?: string;
    user?: User;
    subject?: Extract<AbilitySubjects, string>;
    id?: number;
    newValue?: any;
    oldValue?: any;
};

interface AuditLogGenerator {
    genAuditLog(entries: AuditLogEntry[]): Promise<AuditLog[]>;

    genAuditLog(entry: AuditLogEntry): Promise<AuditLog>;
}

class BasePrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super();
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication): Promise<void> {
        this.$on("beforeExit", async () => {
            await app.close();
        });
    }
}

@Injectable()
export class PrismaService extends BasePrismaService implements AuditLogGenerator {
    constructor() {
        super();
    }

    // Override $transaction so that interactive transactions will expect an ExtendedTransactionClient.
    override $transaction<P extends PrismaPromise<any>[]>(
        arg: [...P],
        options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
    ): Promise<UnwrapTuple<P>>;
    override $transaction<R>(
        fn: (prisma: ExtendedTransactionClient) => Promise<R>,
        options?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
            req?: Request;
        }
    ): Promise<R>;
    override async $transaction(...args: any[]): Promise<any> {
        if (typeof args[0] === "function") {
            const [fn, options] = args;
            return super.$transaction(async (tx) => {
                const extendedTx = tx as ExtendedTransactionClient;
                // Any necessary extension assignments can go here, if they don't work in the Prisma extension...
                return await fn(extendedTx);
            }, options);
        } else {
            return super.$transaction(args);
        }
    }

    genAuditLog(entries: AuditLogEntry[]): Promise<AuditLog[]>;
    genAuditLog(entry: AuditLogEntry): Promise<AuditLog>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async genAuditLog(entry: AuditLogEntry[] | AuditLogEntry): Promise<AuditLog[] | AuditLog> {
        // This method should be implemented in Prisma extensions as that alleviates the need to worry about
        //  binding "this" to the transaction client in transactions, which was causing weird issues for me.
        //  See prisma.module.ts for extension implementation. This method only exists for type definition.
        throw new Error("This method should be implemented in Prisma extensions.");

        /*
        if (Array.isArray(entry)) {
            return Promise.all(entry.map((entry) => this.genAuditLog(entry)));
        }

        return await this.auditLog.create({
            data: {
                message: entry.displayText,
                userId: entry.user?.id,
                subject: entry.subject,
                identifier: entry.id,
                oldValue: entry.oldValue,
                newValue: entry.newValue
            }
        });
         */
    }
}

export interface ExtendedTransactionClient extends Prisma.TransactionClient, AuditLogGenerator {}
