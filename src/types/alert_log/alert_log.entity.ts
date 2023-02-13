import { ObjectType, Field, ID } from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { AlertLog as PrismaAlertLog } from "@prisma/client";

@ObjectType()
export class AlertLog implements PrismaAlertLog {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "AlertLog" is passed to CASL's
     *   can() method, and the passed AlertLog object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "AlertLog" as const;

    /**
     * Unique ID for this alert. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The message logged by this alert. This is what is displayed to the user(s) viewing alerts.
     */
    @MaxLength(300)
    @Field(() => String, { nullable: true })
    message: string | null;

    /**
     * Severity of this alert. Currently can be any value, but should probably be one of the following:
     *  - "INFO"
     *  - "WARN"
     *  - "ERROR"
     *  A Postgres enum could be added in the future to enforce this. This could also be a number, which would allow
     *  for easier filtering of alerts by severity.
     */
    @MaxLength(8)
    @Field(() => String, { nullable: true })
    severity: string | null;

    /**
     * DateTime at which this alert was generated.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;
}
