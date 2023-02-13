import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { Person as PrismaPerson } from "@prisma/client";

@ObjectType()
export class Person implements PrismaPerson {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Person" is passed to CASL's
     *   can() method, and the passed Person object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Person" as const;

    /**
     * Unique ID for this Person. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The name (or pseudonym) for this Person. Should likely be in the format "First Last".
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The pronouns for this Person. Should likely be in the format "they/them". Optional.
     */
    @MaxLength(20)
    @Field(() => String, { nullable: true })
    pronouns: string | null;

    /**
     * The date that this Person intends on graduating from the university. This allows for automated role removals,
     *  as well as displaying the Person's class year on their profile.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    graduation: Date | null;

    /**
     * An "about me" section for this Person.
     */
    @Field(() => String, { nullable: true })
    description: string | null;

    /**
     * ID of the image which should be used for this Person's profile picture.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    profilePictureId: number | null;
}
