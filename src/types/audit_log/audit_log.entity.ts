import {Field, HideField, ID, ObjectType} from "@nestjs/graphql";
import {IsDate, IsInt, MaxLength, Min} from "class-validator";
import {AuditLog as PrismaAuditLog, Prisma} from "@prisma/client";
import {GraphQLBigInt} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

/**
 * Audit logs are used to track changes to resources within the database. At the moment, Prisma does not have an elegant
 *  way of generating these automatically with the user's ID. It would be possible to generate automatically if we
 *  weren't logging the user who made the change using Prisma middleware or extensions. For now, they have to be
 *  logged manually using {@link PrismaService#genAuditLog}. This method is also available on transactions via
 *  {@link ExtendedTransactionClient}.
 *
 *  All automatic generation solutions that I came up with involved violating type safety, relying on private Prisma
 *  interfaces, and/or were so obtuse and hacky that it wasn't worth it.
 *
 * @see {@link https://github.com/prisma/prisma/issues/13851}
 * @see {@link https://github.com/prisma/prisma/issues/6882}
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
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * User ID of the user that initiated this audit log.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    userId: bigint | null;

    /**
     * DateTime at which this audit log was created.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;
    /**
     * Custom message to display to the user when this audit log is displayed. This should be a human-readable message.
     *  This will be combined with the automatically generated message based on {@link #prevValue}.
     */
    @MaxLength(300)
    @Field(() => String, { nullable: true })
    message: string | null;
    /**
     * The type of subject which was changed. This should be one of the values in {@link AbilitySubjects}. If the change
     *  was to a resource that is not a subject, this should be null.
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    subject: string | null;
    /**
     * Identifier of the resource that was changed. This should be the ID of the resource. If {@link #subject} is null,
     *  then this should also be null.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    identifier: bigint | null;
    /**
     * The new value of the resource after the change. Will be null if the resource was deleted, since there is no
     *  updated value. This value cannot be queried directly, and is used internally for constructing an audit log
     *  message. It is also useful for reverting changes, if ever desired. This value is typically going to be an
     *  object (particularly if {@link #subject} is non-null), but it can technically be any value.
     */
    @HideField()
    newValue: Prisma.JsonValue | null;
    /**
     * The previous value of the resource before the change. Will be null if the resource was created, since there was
     *  no previous value. This value cannot be queried directly, and is used internally for constructing an audit log
     *  message. It is also useful for reverting changes, if ever desired. This value is typically going to be an
     *  object (particularly if {@link #subject} is non-null), but it can technically be any value.
     */
    @HideField()
    oldValue: Prisma.JsonValue | null;
}
