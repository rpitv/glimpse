const { Person } = require('./Person');
const { pool } = require('../db-pool');

/**
 * Role class
 * A Role is simply what position a Person holds in the club throughout a given time interval. This could be a Member,
 * an Officer, the President, etc. Any Person which has at least one active Role is assumed to be a member of the club
 * while said Role is active.
 *
 * All Roles must have an associated owner (Person) which you can fetch with {@link getOwner}. {@link this.id},
 * {@link this.startDate} and {@link this.name} must also be non-null. {@link endDate} can be null, in which case
 * it should be assumed that the Person is still an active member of the club.
 *
 * When displayed, Roles are displayed in a sequential order which can be determined by the column "appears_after"
 * in the database, which can be read with {@link getPreviousRole}. When displaying all of some Person's Role (or
 * perhaps a subset of them), this Role must be displayed immediately after the Role returned by {@link getPreviousRole}
 * if it exists (or one of that Role's previous Roles, in the case that not all Roles are being displayed). If there
 * is no link between two {@link Role}s, then they should be ordered in some other way (e.g. alphabetically, or based
 * off of start date).
 */
class Role {

    /**
     * Instantiate a new instance of Role with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this role, use {@link getRoleFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getRoleFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
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
        const response = await pool.query('SELECT name,start_date,end_date FROM roles ' +
            'WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length !== 0) {
            return false;
        }
        this.name = response.rows[0].name;
        this.startDate = response.rows[0].start_date;
        this.endDate = response.rows[0].end_date;
        return true;
    }

    /**
     * Save any changes made to this person's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE roles SET start_date=$1, end_date=$2, name=$3 WHERE id=$4', [
            this.startDate,
            this.endDate,
            this.name,
            this.id
        ]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the owner {@link Person} of this role. This is the person whom this role belongs to.
     * @returns {Promise<Person>} The owner of this Role
     * @throws PostgreSQL error
     */
    async getOwner() {
        const idResponse = await pool.query('SELECT person FROM roles WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].person == null)
            return null;
        return Person.getPersonFromId(idResponse.rows[0].person);
    }

    /**
     * Set the owner {@link Person} of this role. This is the person whom this role belongs to.
     * @param person {Person|number} The Person to set to be the owner of this Role, or their unique ID.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setOwner(person) {
        const id = (person == null ? null : person instanceof Person ? person.id : person);
        const response = await pool.query('UPDATE roles SET person=$1 WHERE id=$2 LIMIT 1', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the role which this role appears after in a list. When a person's roles are all displayed, this role should
     * be displayed after the role returned by this method.
     * @returns {Promise<Role|null>} The role to display before this role, or null if it does not exist.
     */
    async getPreviousRole() {
        const idResponse = await pool.query('SELECT appears_after FROM roles WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].person == null)
            return null;
        return Role.getRoleFromId(idResponse.rows[0].appears_after);
    }

    /**
     * Set the role which this role appears after in a list.
     * @param newRole {Role|number|null} Previous role to update this role to have, or a role's ID. The previous role is
     * the role that sequentially appears before this one when all of a users roles are listed out. Pass null if you
     * wish to remove this role's previous node.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     */
    async setPreviousRole(newRole) {
        const id = (newRole == null ? null : newRole instanceof Role ? newRole.id : newRole);
        const response = await pool.query('UPDATE roles SET appears_after=$1 WHERE id=$2 LIMIT 1', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get a role from the database, given its unique ID.
     * @param id {number} ID to search for in the database
     * @returns {Promise<null|Role>} The fetched role, or null if the role does not exist.
     * @throws PostgreSQL error
     */
    static async getRoleFromId(id) {
        const role = new Role(id);
        if(await role.fetch()) {
            return role;
        }
        return null;
    }

    /**
     * Get an array of a person's roles; Current, past, and future.
     * @param person {Person|number} The person to get the roles of
     * @returns {Promise<[Role]>} Array of roles that belong to that person
     */
    static async getRolesForPerson(person) {
        if(person instanceof Person) {
            person = person.id;
        }
        const result = await pool.query('SELECT * FROM roles WHERE person=$1', [person]);
        const roles = [];
        for(let i = 0; i < result.rows.length; i++) {
            const item = result.rows[i];
            const role = new Role(item.id);
            role.endDate = item.end_date;
            role.startDate = item.start_date;
            role.name = item.name;
            roles.push(role);
        }
        return roles;
    }
}

module.exports = { Role };
