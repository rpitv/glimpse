import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsObject, MaxLength, MinLength } from "class-validator";
import { ContactSubmission as PrismaContactSubmission, ContactSubmissionType, Prisma } from "@prisma/client";
import { GraphQLBigInt, GraphQLJSON } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class ContactSubmission implements PrismaContactSubmission {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ContactSubmission" is passed to CASL's
     *   can() method, and the passed ContactSubmission object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ContactSubmission" as const;

    /**
     * Unique ID for this ContactSubmission. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The email address for how to reach the person who submitted this ContactSubmission.
     */
    @MaxLength(300)
    @Field(() => String)
    email: string;

    /**
     * The type of this particular ContactSubmission. Useful for determining how to read the `additionalData`, or for
     * determining what sort of notifications to send.
     */
    @Field(() => ContactSubmissionType)
    type: ContactSubmissionType;

    /**
     * The name of the person who submitted this ContactSubmission.
     */
    @MaxLength(100)
    name: string;

    /**
     * The subject/title of the ContactSubmission. Used as the production title in production requests.
     */
    @MinLength(5)
    @MaxLength(100)
    subject: string;

    /**
     * The main body of the ContactSubmission. Used for additional details in production requests.
     */
    @MinLength(15)
    @MaxLength(1000)
    body: string;

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
     * Additional unstructured data about this ContactSubmission. Format is determined by the {@link #type} property.
     */
    @IsObject()
    @Field(() => GraphQLJSON, { nullable: true })
    additionalData: Prisma.JsonValue | null;
}
