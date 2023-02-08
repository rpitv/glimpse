import {ObjectType, Field, ID, Int, HideField} from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { AuditLog as PrismaAuditLog } from "@prisma/client";

/**
 * Audit logs are used to track changes to resources within the database. They are created automatically by the
 *  {@link AuditLogPrismaMiddleware} when a resource is created, deleted, or updated. Read queries are not logged.
 *  In transactions, the audit log is reverted if the transaction is reverted.
 */
@ObjectType()
export class AuditLog implements PrismaAuditLog {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "AuditLog" is passed to CASL's
     *   can() method, and the passed AuditLog object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "AuditLog" as const;

    /**
     * Unique ID for this audit log. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * User ID of the user that initiated this audit log.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    userId: number | null;

    /**
     * DateTime at which this audit log was created.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;

    /**
     * The type of modification that was performed. One of "create", "update", or "delete".
     */
    @MaxLength(20)
    @Field(() => String, { nullable: true })
    modificationType: string | null;

    /**
     * Name of the table which was modified.
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    modifiedTable: string | null;

    /**
     * Name of the column which was modified.
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    modifiedField: string | null;

    /**
     * The value of the field before the modification was performed. Only present for "update" and "delete" logs.
     */
    @Field(() => Int, { nullable: true })
    previousValue: string | null;

    /**
     * Any comment on the modification. These can be added manually, but are not present on automatically-generated
     *  audit logs.
     */
    @Field(() => Int, { nullable: true })
    comment: string | null;

    /**
     * JSON metadata for this audit log. This can be used to store additional information about the modification.
     *  Currently, this cannot be read or modified by the user.
     */
    @HideField()
    metadata: any | null;
}
