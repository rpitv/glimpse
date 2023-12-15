import { INestApplication, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient, UnwrapTuple } from "@prisma/client";
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

const logger = new Logger("genAuditLog");
/**
 * General purpose audit log generator function. This function should not be called directly. It must first be bound
 *  to the context of a Prisma transaction client. It's used both in {@link PrismaService#$transaction} and
 *  {@link PrismaService#genAuditLog}.
 *
 *  This could be done in a Prisma extension if this issue is resolved: https://github.com/prisma/prisma/issues/17948
 * @param entry Audit log entry/entries
 */
async function genAuditLog(entry: AuditLogEntry[] | AuditLogEntry): Promise<AuditLog[] | AuditLog> {
    if (Array.isArray(entry)) {
        return Promise.all(entry.map((entry) => this.genAuditLog(entry)));
    }

    logger.verbose(`Generating audit log: ${JSON.stringify(entry)}`);
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
}

@Injectable()
export class PrismaService extends BasePrismaService implements AuditLogGenerator {
    constructor() {
        super();
    }

    // Override $transaction so that interactive transactions will expect an ExtendedTransactionClient.
    override $transaction<P extends Prisma.PrismaPromise<any>[]>(
        arg: [...P],
        options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
    ): Promise<UnwrapTuple<P>>;
    override $transaction<R>(
        fn: (prisma: Omit<this, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) => Promise<R>,
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
                // Any necessary extension assignments can go here...
                tx.genAuditLog = genAuditLog.bind(tx);

                return await fn(tx);
            }, options);
        } else {
            return super.$transaction(args);
        }
    }

    genAuditLog(entries: AuditLogEntry[]): Promise<AuditLog[]>;
    genAuditLog(entry: AuditLogEntry): Promise<AuditLog>;
    async genAuditLog(entry: AuditLogEntry[] | AuditLogEntry): Promise<AuditLog[] | AuditLog> {
        return genAuditLog.bind(this)(entry);
    }
}
