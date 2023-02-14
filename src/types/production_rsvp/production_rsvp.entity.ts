import { ObjectType, Field, ID } from "@nestjs/graphql";
import { IsInt, Min } from "class-validator";
import { ProductionRSVP as PrismaProductionRSVP } from "@prisma/client";

@ObjectType()
export class ProductionRSVP implements PrismaProductionRSVP {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ProductionRSVP" is passed to CASL's
     *   can() method, and the passed ProductionRSVP object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ProductionRSVP" as const;

    /**
     * Unique ID for this ProductionRSVP. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: bigint | null;

    /**
     * ID of the Production that the User is RSVPing for.
     */
    @Min(0)
    @Field(() => ID, { nullable: true })
    productionId: bigint | null;

    /**
     * ID of the User that is RSVPing for the Production.
     */
    @Min(0)
    @Field(() => ID, { nullable: true })
    userId: bigint | null;

    /**
     * The User's response to the Production's RSVP. Should be "yes", "no", or "maybe".
     */
    @Field(() => String, { nullable: true })
    willAttend: string | null;

    /**
     * Any additional notes provided by the User, officers, or producers.
     */
    @Field(() => String, { nullable: true })
    notes: string | null;
}
