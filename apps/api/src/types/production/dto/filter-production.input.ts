import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import { BooleanComparisonInput } from "../../../gql/boolean-comparison.input";

/**
 * Input type for filtering Productions in ReadMany queries.
 */
@InputType()
export class FilterProductionInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    name?: StringComparisonInput;
    /**
     * Filter by description
     */
    description?: StringComparisonInput;
    /**
     * Filter by start time
     */
    startTime?: DateComparisonInput;
    /**
     * Filter by end time
     */
    endTime?: DateComparisonInput;
    /**
     * Filter by category ID
     */
    categoryId?: NumberComparisonInput;
    /**
     * Filter by closet location
     */
    closetLocation?: StringComparisonInput;
    /**
     * Filter by closet time
     */
    closetTime?: DateComparisonInput;
    /**
     * Filter by event location
     */
    eventLocation?: StringComparisonInput;
    /**
     * Filter by team notes
     */
    teamNotes?: StringComparisonInput;
    /**
     * Filter by thumbnail Image ID
     */
    thumbnailId?: NumberComparisonInput;
    /**
     * Filter by ID of the Discord server that {@link discordChannel} belongs to
     */
    discordServer?: StringComparisonInput;
    /**
     * Filter by ID of the Discord channel that this production's communication takes place in
     */
    discordChannel?: StringComparisonInput;
    /**
     * Filter by whether this production's Discord channel has been archived by the Discord bot
     */
    isDiscordChannelArchived?: BooleanComparisonInput;
    /**
     * Filter by ID of the Discord message that volunteers can react to volunteer for this production
     */
    discordVolunteerMessage?: StringComparisonInput;
    /**
     * Filter by ID of the Discord message that volunteers can react to unvolunteer for this production
     */
    discordUnvolunteerMessage?: StringComparisonInput;

    AND?: FilterProductionInput[];
    OR?: FilterProductionInput[];
    NOT?: FilterProductionInput;
}
