import { ObjectType, Field, ID } from "@nestjs/graphql";
import {IsBoolean, IsDate, IsInt, IsObject, MaxLength, Min} from "class-validator";
import {ContactSubmission as PrismaContactSubmission, Prisma} from "@prisma/client";
import JSON from 'graphql-type-json';

@ObjectType()
export class ContactSubmission implements PrismaContactSubmission {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ContactSubmission" is passed to CASL's
     *   can() method, and the passed ContactSubmission object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ContactSubmission" as const;

    /**
     * Unique ID for this blog post. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The email address for how to reach the person who submitted this ContactSubmission.
     */
    @MaxLength(300)
    @Field(() => String, { nullable: true })
    email: string | null;

    /**
     * The name of the person who submitted this ContactSubmission.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * Timestamp at which this ContactSubmission was submitted.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;

    /**
     * Flag whether this contact submission has been resolved or not.
     */
    @IsBoolean()
    @Field(() => Boolean, { nullable: true })
    resolved: boolean | null;

    /**
     * Additional metadata about this ContactSubmission. Unstructured JSON data.
     */
    @IsObject()
    @Field(() => JSON, { nullable: true })
    additionalData: Prisma.JsonValue | null;
}
