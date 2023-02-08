import { ObjectType, Field, ID } from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { AccessLog as PrismaAccessLog } from "@prisma/client";

@ObjectType()
export class AccessLog implements PrismaAccessLog {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "AccessLog" is passed to CASL's
     *   can() method, and the passed AccessLog object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "AccessLog" as const;

    /**
     * Unique ID for this AccessLog. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the user who initiated this access log.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    userId: number | null;

    /**
     * Name of the service which this access log is a record for.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    service: string | null;

    /**
     * DateTime at which this access log was generated.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;

    /**
     * IP address which the access that generated this access log originated from.
     */
    @MaxLength(60)
    @Field(() => String, { nullable: true })
    ip: string | null;
}
