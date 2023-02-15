import { ObjectType, Field } from "@nestjs/graphql";
import { IsString, IsUUID } from "class-validator";
import { GraphQLUUID } from "graphql-scalars";

@ObjectType()
export class Stream {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Stream" is passed to CASL's
     *   can() method, and the passed Stream object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Stream" as const;

    /**
     * Unique ID for this stream. Automatically generated.
     */
    @IsUUID()
    @Field(() => GraphQLUUID, { nullable: true })
    id: string | null;

    /**
     * The location this stream is being pushed to.
     */
    @IsString()
    @Field(() => String, { nullable: true })
    to: string | null;

    /**
     * The location this stream is being pulled from.
     */
    @IsString()
    @Field(() => String, { nullable: true })
    from: string | null;

    /**
     * The latest message from this stream.
     */
    @IsString()
    @Field(() => String, { nullable: true })
    message: string | null;
}
