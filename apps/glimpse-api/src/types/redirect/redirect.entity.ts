import {Field, ObjectType} from "@nestjs/graphql";
import {IsDate, MaxLength} from "class-validator";
import {Redirect as PrismaRedirect} from "@prisma/client";
import {GraphQLBigInt} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

@ObjectType()
export class Redirect implements PrismaRedirect {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Redirect" is passed to CASL's
     *   can() method, and the passed Redirect object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Redirect" as const;

    /**
     * Unique ID for this Redirect. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The key used in URLs to access this Redirect.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    key: string | null;

    /**
     * The URL which this Redirect redirects to.
     */
    @MaxLength(3000)
    @Field(() => String, { nullable: true })
    location: string | null;

    /**
     * The date and time at which this Redirect expires. If null, this Redirect never expires.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    expires: Date | null;
}
