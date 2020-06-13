const { pool } = require('../util/db-pool');
const { Person } = require('./Person');
const { PermissionTools } = require('../util/Permissions');


function UserModelFactory(SEEKER, SUPER_ACCESS) {

    /**
     * User class
     * Users are accounts which are capable of logging into the system. Users do not have much associated metadata
     * beyond their join date, email, and permission level. To have more strict metadata, a user must be associated
     * with a {@link Person}.
     *
     * Requires that {@link this.id} and {@link this.email} be non-null.
     */
    class User {

        /**
         * Instantiate a new instance of User with the provided ID. Does not fetch data.
         * If you want to get the appropriate data for this user, use {@link getUserFromId} or
         * {@link fetch}. If you call {@link save} before calling one of these two methods,
         * {@link save} will attempt to write "undefined" to all fields. Avoid using this
         * constructor directly, and use {@link getUserFromId} instead.
         * @param id {number} Numerical ID to instantiate with.
         */
        constructor(id) {
            this.id = id;
        }

        /**
         * Fetch the latest data from the database and refresh this object's properties.
         * Requires USER permission if self, ADMIN otherwise
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         * @returns {Promise<boolean>} Returns true on success, false on failure,
         *          e.g. row with {@link this.id} does not exist.
         */
        async fetch() {
            if(this.id === SEEKER.id) {
                PermissionTools.assertIsUser(SEEKER, SUPER_ACCESS);
            } else {
                PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            }
            const response = await pool.query('SELECT email,joined,permission_level FROM users WHERE id=$1 LIMIT 1', [this.id]);
            if(response.rows.length === 0) {
                return false;
            }
            this.joined = response.rows[0].joined;
            this.permissionLevel = response.rows[0].permission_level;
            this.email = response.rows[0].email;
            return true;
        }

        /**
         * Save any changes made to this user's "primitives" to the database
         * Simply pushes an update to the database to rows where id == this.id
         * Requires ADMIN permission
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         * @returns {Promise<boolean>} True on successful save, false otherwise
         */
        async save() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('UPDATE users SET email=$1, permission_level=$2, joined=$3 WHERE id=$4', [
                this.email,
                this.permissionLevel,
                this.joined,
                this.id
            ]);
            return response && response.rowCount > 0;
        }

        /**
         * Create a new user in the database.
         * Requires SUPER ACCESS (perhaps change to admin?)
         * @param email {string} This user's email. Should be unique.
         * @param permissionLevel {number} The permission level this user should have. 0 = User, 1 = Admin, 2 = Superadmin
         * @param identity {Person | number} This new user's associated Person identity
         * @returns {Promise<User>} the new User object
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         */
        static async createUser(email, permissionLevel = 0, identity = null) {
            PermissionTools.assertHasSuperAccess(SEEKER, SUPER_ACCESS);
            const response = await pool.query('INSERT INTO users (email, permission_level, identity)' +
                ' VALUES ($1, $2, $3) RETURNING *', [email, permissionLevel, identity]);

            const user = new User(response.rows[0].id);
            user.email = response.rows[0].email;
            user.permissionLevel = response.rows[0].permission_level;
            user.joined = response.rows[0].joined;
            return user;
        }

        /**
         * Get all Users in the database.
         * Requires ADMIN permission
         * @returns {Promise<[User]>} All Users in the database.
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         */
        static async getAllUsers() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('SELECT id, email, joined, permission_level FROM users ORDER BY joined');
            const users = [];
            for(let i = 0; i < response.rows.length; i++) {
                const user = new User(response.rows[i].id);
                user.permissionLevel = response.rows[i].permission_level;
                user.email = response.rows[i].email;
                user.joined = response.rows[i].joined;
                users.push(user);
            }
            return users;
        }

        /**
         * Get a subset list of all users in a paginated manner.
         * Requires ADMIN permission
         * @param perPage {number} The total number of users to respond with per page. If less than or equal to 0, all users are
         * returned.
         * @param lastUserIndex {number} The index position of the last user in the list from the last time this method was called.
         * If lastUserIndex < -1 then this value is defaulted to -1.
         * @returns {Promise<[User]>} An array of users.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async getPaginatedUsers(perPage, lastUserIndex) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            // Go back to page one if an invalid lastUserIndex is provided.
            if(lastUserIndex == null || lastUserIndex < -1)
                lastUserIndex = -1;
            // Return all users if no item count per page is provided.
            if(perPage == null || perPage <= 0)
                return (await this.getAllUsers()).slice(lastUserIndex);

            const response = await pool.query('SELECT id, email, joined, permission_level FROM users ORDER BY joined' +
                ' LIMIT $1 OFFSET $2', [perPage, lastUserIndex + 1]);
            const users = [];
            for(let i = 0; i < response.rows.length; i++) {
                const user = new User(response.rows[i].id);
                user.permissionLevel = response.rows[i].permission_level;
                user.email = response.rows[i].email;
                user.joined = response.rows[i].joined;
                users.push(user);
            }
            return users;
        }

        /**
         * Get the total number of users in the database.
         * Requires ADMIN permission
         * @returns {Promise<number>} The total number of users in the database.
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         */
        static async getUserCount() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('SELECT COUNT(id) FROM users;');
            return response.rows[0].count;
        }

        /**
         * Get a user from the database, given their email.
         * Requires ADMIN permission
         * @param email {string} Email to search for.
         * @returns {Promise<null|User>} The fetched user, or null if the user does not exist.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async getUserFromEmail(email) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            if(!email || !email.toLowerCase) { // return if object w/o toLowerCase function is passed (i.e. not string)
                return null;
            }

            email = email.toLowerCase();
            const response = await pool.query('SELECT id,joined,permission_level FROM "users" WHERE email=$1 LIMIT 1', [email]);
            if(response.rows.length === 0)
                return null;
            const user = new User(response.rows[0].id);
            user.permissionLevel = response.rows[0].permission_level;
            user.email = email;
            user.joined = response.rows[0].joined;
            return user;
        }

        /**
         * Get a user from the database, given their unique ID.
         * Requires USER permission if self, ADMIN permission otherwise (inherited from {@link this.fetch})
         * @param id {number} ID to search for in the database
         * @returns {Promise<null|User>} The fetched user, or null if the user does not exist.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async getUserFromId(id) {
            if(id == null)
                return null;
            const user = new User(id);
            if(await user.fetch()) {
                return user;
            }
            return null;
        }

        /**
         * Set this user's identity to a person or person ID
         * Requires ADMIN permission
         * @param person {Person | number} The Person object or their ID, or null to remove their identity.
         * @returns {Promise<boolean>} True on successfully updated, false otherwise.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        async setIdentity(person) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const id = (person == null ? null : person instanceof Person ? person.id : person);
            const response = await pool.query('UPDATE users SET identity=$1 WHERE id=$2', [id, this.id]);
            return response && response.rowCount > 0;
        }

        /**
         * Get this user's associated identity, if they have one.
         * Requires USER permission if self, ADMIN permission otherwise.
         * @return {Promise<Person|null>} Person, or null if user has no identity.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        async getIdentity() {
            if(this.id === SEEKER.id) {
                PermissionTools.assertIsUser(SEEKER, SUPER_ACCESS);
            } else {
                PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            }

            const idResponse = await pool.query('SELECT identity FROM users WHERE id=$1 LIMIT 1', [this.id]);
            if(idResponse.rows.length === 0 || idResponse.rows[0].identity == null)
                return null;
            return Person.getPersonFromId(idResponse.rows[0].identity);
        }
    }

    return User;
}

const User = UserModelFactory(null, true);

module.exports = { User, UserModelFactory };
