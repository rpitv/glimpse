import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";

export interface GlimpseApiEvents {
    /**
     * Event fires whenever a Production is created on the website.
     * @param production Production that was created.
     */
    createProduction: (production: Production) => void;
    /**
     * Event fires whenever a Production is updated on the website.
     * This event fires whenever a Production itself is changed but does
     * not fire whenever its category or tags change.
     * @param production Production that was updated.
     */
    updateProduction: (production: Production) => void;
    /**
     * Event fires whenever a Production is deleted on the website.
     * @param production The Production that was just deleted.
     */
    deleteProduction: (production: Production) => void;
    /**
     * Event fires whenever a User is updated on the website.
     * This event also fires whenever the User's Person or their Person's
     * Role(s) change.
     * Note that, since Roles can be applied to multiple Persons, a change
     * to a Role could result in this event firing many times in quick
     * succession.
     * Keep this in mind to avoid hitting rate limits.
     * @param user The User that was just updated.
     */
    updateUser: (user: User) => void;
    /**
     * Event fires whenever a User is deleted on the website.
     * @param user The User what was just deleted.
     */
    deleteUser: (user: User) => void;
}

export interface GlimpseApiInterface extends TypedEmitter<GlimpseApiEvents> {
    /**
     * Get a User from their ID.
     * @param userId bigint ID of the User.
     * @returns {@link ApiResponse} with the User's data, or null if the User does not exist.
     * @throws Error connection or database error.
     */
    getUserFromUserId(userId: bigint): Promise<ApiResponse<User | null>>;

    /**
     * Get a User from their Discord account ID.
     * @param discordUserId ID of the User's Discord account.
     * @returns {@link ApiResponse} with the User's data, or null if the User does not exist.
     * @throws Error connection or database error.
     */
    getUserFromDiscordId(discordUserId: string): Promise<ApiResponse<User | null>>;

    /**
     * Register a new User account for a Discord user.
     * @param discordUserId ID of the Discord account creating an account.
     * @param username Username of the User to create.
     *                 Must match the regular expression `^[a-z][-a-z0-9]{0,7}$`.
     * @param email Email address for the User.
     *              Must be a valid email address; max length of 300 characters.
     * @returns {@link ApiResponse} with the newly created User's data.
     * @throws Error connection or database error.
     * @throws UserError there's already a User associated with the provided Discord account ID.
     * @throws UserError the provided username or email address is already taken
     * @throws UserError the provided username or email address is invalid
     */
    registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>>;

    /**
     * Update a User's volunteer status for a Production.
     * @param discordUserId The Discord account ID of the User to update the status for.
     * @param productionId The ID of the Production to update the volunteer status for.
     * @param status The status to update to (true == will be present).
     * @param notes Optional notes to apply to the volunteer status.
     *              Leave as `undefined` to leave notes unchanged, or `null` to remove any current notes.
     * @throws Error connection or database error.
     * @throws Error the provided Production ID does not exist.
     * @throws UserError the provided Discord account ID is not associated with any User.
     * @returns An empty {@link ApiResponse}
     */
    updateUserVolunteerStatus(discordUserId: string, productionId: bigint, status: boolean, notes?: string | null): Promise<ApiResponse<void>>;

    /**
     * Store JSON data containing information about a Production's Discord channel, messages,
     * etc. in the database.
     * @param productionId ID of the Production to update.
     * @param data Schemaless data to store in the database.
     *             The lack of a schema allows flexibility in changing Discord structure/implementation
     *             without requiring an update to the API/database.
     * @throws Error connection or database error.
     * @throws Error the provided Production ID does not exist.
     * @returns An empty {@link ApiResponse}
     */
    setProductionDiscordData(productionId: bigint, data: Record<string, any>): Promise<ApiResponse<void>>;

    /**
     * Get all active and upcoming Productions.
     *
     * To be included in this list, a Production must meet the following criteria:
     * - `useDiscord` set to true.
     * - `startTime` is within the next 7 days, or
     * - `endTime` is in the future or less than 24 hours in the past.
     * - In the event that `startTime`, `endTime`, and `closetTime` are not all set,
     *   the latest time will silently be used in place of those which are missing.
     * - In the event that `endTime` precedes `startTime` (anomaly), `startTime` is ignored.
     * - A Production that does not have a `startTime`, `endTime`, or `closetTime` will never appear.
     * @returns {@link ApiResponse} with an array of Productions that match the given criteria.
     * @throws Error connection or database error.
     */
    getLatestProductions(): Promise<ApiResponse<Production[]>>;

    /**
     * Get a Production from its ID.
     * @param productionId bigint ID of the Production.
     * @returns {@link ApiResponse} with the Production's data, or null if the Production does not exist.
     * @throws Error connection or database error.
     */
    getProductionData(productionId: bigint): Promise<ApiResponse<Production | null>>;
}
