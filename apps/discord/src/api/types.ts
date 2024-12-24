
export interface Production {
    /**
     * ID of the Production
     * @example 10n
     */
    id: bigint;
    /**
     * Display name of the Production.
     * Max length of 100 characters.
     * @example "Men's Hockey vs. Union College"
     */
    name: string;
    /**
     * Displayed description of the Production.
     * @example "Union College from Schenectady, NY plays Rensselaer Polytechnic Institute in Troy, NY."
     */
    description?: string;
    /**
     * Time at which the Production is starting.
     */
    startTime?: Date;
    /**
     * Approximate time at which the Production (and subsequent cleanup) is expected to end.
     */
    endTime?: Date;
    /**
     * Time at which crew members should meet at the specified closet location.
     */
    closetTime?: Date;
    /**
     * The location at which team members should meet, prior to the event, at the specified closet time.
     * Max length of 100 characters.
     * @example "RPI TV Office"
     */
    closetLocation?: string;
    /**
     * The location at which the event is taking place.
     * Max length of 100 characters.
     * @example "Houston Field House"
     */
    eventLocation?: string;
    /**
     * The name of the Category which this Production is classified under.
     * Category names have a max length of 50 characters.
     * This is joined in from the Category relation the database.
     * @example "Women's Ice Hockey"
     */
    category?: string;
    /**
     * A list of all ProductionTag names which are applied to this Production.
     * ProductionTag names have a max length of 50 characters.
     * This is joined in from the `ProductionTag` relation in the database.
     * @example ['hockey', 'private']
     */
    tags: string[];
    /**
     * Any notes about the production from RPI TV team members or officers.
     * @example "Please wear your RPI TV shirt!"
     */
    teamNotes?: string;
    /**
     * Whether a Discord thread should be created for this Production, which members
     * can volunteer for.
     */
    useDiscord: boolean;
    /**
     * Schemaless data connecting the Production to all relevant Discord threads/channels/messages/etc.
     * The lack of a schema allows flexibility to change how users volunteer for Productions, or
     * where volunteers communicate, in future updates to this Discord bot without a corresponding
     * API/database update.
     * @example { "threadId": "1317312092893876314", "volunteerMessageId": "1317155990273003581" }
     */
    discordData?: Record<string, any>;

    /**
     * Array of {@link ProductionRSVP} objects signifying who is/is not volunteering for this Production.
     * Each ProductionRSVP object contains the User ID of the volunteer.
     * Get the corresponding User with {@link GlimpseApiInterface#getUserFromUserId}.
     * Note: Users don't technically need a Discord account to RSVP, so when displaying a list of
     * volunteers in Discord, fall back to usernames/person names when Discord is not linked.
     */
    rsvps: ProductionRSVP[]
}

export interface User {
    /**
     * ID of the User
     * @example 10n
     */
    id: bigint;
    /**
     * Username of the User, usually an RCS ID.
     * Max length of eight characters.
     * @example "robere2"
     */
    username: string;
    /**
     * Email associated with the User.
     * Max length of 300 characters.
     * @example "john@example.com"
     */
    mail: string;
    /**
     * ID of the linked Person (profile), if it exists.
     * Users aren't required to have a Person linked in order to volunteer for Productions,
     * but if they have a Person, then it can later automatically be added as a Credit.
     * @example 10n
     */
    personId?: bigint;
    /**
     * The name of the Person, if they have one linked.
     * Max length of 100 characters.
     * This is joined in from the Person relation in the database.
     * @example "John Smith"
     */
    personName?: string;
    /**
     * A list of Roles that the linked Person currently holds (their PersonRole has a start time
     * earlier than now, but an end time later than now).
     * This is joined in from the Person and PersonRole relations in the database.
     *
     * If the User has no Person linked, this will not be defined.
     * If the User has a linked Person, but that Person has no Roles, then this will be empty.
     * @see Role
     */
    personCurrentRoles?: Role[];
    /**
     * The Date that the linked Person (if present) is graduating from RPI, if set.
     * This is joined in from the Person relation in the database.
     */
    personGraduation?: Date;
    /**
     * The linked Discord account ID, or undefined if no Discord account is linked.
     * @example "255781419387846657"
     */
    discord?: string;
}

export interface ProductionRSVP {
    /**
     * ID of the Production that the User is RSVPing for.
     * @example 21n
     */
    productionId: bigint,
    /**
     * ID of the User which is RSVPing for the Production.
     * @example 15n
     */
    userId: bigint,
    /**
     * A string value "yes" or "no" indicating whether the user will attend.
     * Strings are used to simplify expansion into other options (e.g. "maybe").
     * @example "yes"
     */
    willAttend?: string
    /**
     * Any notes about the User's attendance.
     * This could be set by the User or by an Officer.
     * @example "I'll be late to closet time by 15 minutes."
     */
    notes?: string
}

export interface Role {
    /**
     * ID of the Role.
     * @example 10n
     */
    id: bigint;
    /**
     * Display name of the Role.
     * Max length of 100 characters.
     * @example "Facilities & Equipment Manager"
     */
    name: string;
    /**
     * Whether this Role is a leadership position.
     */
    isLeadership: boolean;
    /**
     * Whether this Role is listed within the club membership.
     */
    isMembership: boolean;
}
