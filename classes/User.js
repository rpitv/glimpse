const { pool } = require('../db-pool');
const { Person } = require('./Person');

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
     * @param id {number} ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Fetch the latest data from the database and refresh this object's properties.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} Returns true on success, false on failure,
     *          e.g. row with {@link this.id} does not exist.
     */
    async fetch() {
        const response = await pool.query('SELECT email,joined,is_admin FROM users WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length !== 0) {
            return false;
        }
        this.joined = response.rows[0].joined;
        this.isAdmin = !!response.rows[0].is_admin;
        this.email = response.rows[0].email;
        return true;
    }

    /**
     * Save any changes made to this user's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE users SET email=$1, is_admin=$2, joined=$3 WHERE id=$4', [
            this.email,
            this.isAdmin,
            this.joined,
            this.id
        ]);
        return response && response.rowCount > 0;
    }

    /**
     * Create a new user in the database.
     * @param email {string} This user's email. Should be unique.
     * @param isAdmin {boolean} Whether or not this user should be an admin
     * @param identity {Person | number} This new user's associated Person identity
     * @returns {Promise<User>} the new User object
     * @throws PostgreSQL error
     */
    static async createUser(email, isAdmin = false, identity = null) {
        const response = await pool.query('INSERT INTO users (email, is_admin, identity) VALUES ($1, $2, $3) RETURNING *', [
            email, isAdmin, identity
        ]);

        const user = new User(response.rows[0].id);
        user.email = response.rows[0].email;
        user.isAdmin = !!response.rows[0].is_admin;
        user.joined = response.rows[0].joined;
        return user;
    }

    /**
     * Get all Users in the database.
     * @returns {Promise<[User]>} All Users in the database.
     */
    static async getAllUsers() {
        const response = await pool.query('SELECT id, email, joined, is_admin FROM users');
        const users = [];
        for(let i = 0; i < response.rows.length; i++) {
            const user = new User(response.rows[i].id);
            user.isAdmin = !!response.rows[i].is_admin;
            user.email = response.rows[i].email;
            user.joined = response.rows[i].joined;
            users.push(user);
        }
        return users;
    }

    /**
     * Get a user from the database, given their email.
     * @param email {string} Email to search for.
     * @returns {Promise<null|User>} The fetched user, or null if the user does not exist.
     * @throws PostgreSQL error
     */
    static async getUserFromEmail(email) {
        const response = await pool.query('SELECT id,joined,is_admin FROM user WHERE email=$1 LIMIT 1', [email]);
        if(response.rows.length === 0)
            return null;
        const user = new User(response.rows[0].id);
        user.isAdmin = !!response.rows[0].is_admin;
        user.email = email;
        user.joined = response.rows[0].joined;
        return user;
    }

    /**
     * Get a user from the database, given their unique ID.
     * @param id {number} ID to search for in the database
     * @returns {Promise<null|User>} The fetched user, or null if the user does not exist.
     * @throws PostgreSQL error
     */
    static async getUserFromId(id) {
        const user = new User(id);
        if(await user.fetch()) {
            return user;
        }
        return null;
    }

    /**
     * Set this user's identity to a person or person ID
     * @param person {Person | number} The Person object or their ID, or null to remove their identity.
     * @returns {Promise<boolean>} True on successfully updated, false otherwise.
     * @throws PostgreSQL error
     */
    async setIdentity(person) {
        const id = (person == null ? null : person instanceof Person ? person.id : person);
        const response = await pool.query('UPDATE users SET identity=$1 WHERE id=$2 LIMIT 1', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get this user's associated identity, if they have one.
     * @return {Promise<Person|null>} Person, or null if user has no identity.
     * @throws PostgreSQL error
     */
    async getIdentity() {
        const idResponse = await pool.query('SELECT identity FROM users WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].identity == null)
            return null;
        return Person.getPersonFromId(idResponse.rows[0].identity);
    }
}

module.exports = { User };
