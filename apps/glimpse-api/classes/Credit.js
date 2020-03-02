const { pool } = require('../db-pool');
const { Person } = require('./Person');
const { Production } = require('./Production');

/**
 * Credit class
 * A Credit is an acknowledgement of some Person's contribution to a Production, and what they did for that
 * Production. A Person CAN have multiple Credits for a single Production, and a Production can have multiple
 * Credits, whether for the same Person or different people.
 * Credits have an ID {@link Credit.id}, a Person {@link Credit.getPerson()},
 * a Production {@link Credit.getProduction()}, a job {@link Credit.job}, and a sequential linked-list-style order,
 * defined by {@link Credit.getPreviousCredit()}. The ID, Person, Production, and job are required to be non-null.
 */
class Credit {

    /**
     * Instantiate a new instance of Credit with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this credit, use {@link getCreditFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getCreditFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Save any changes made to this credit's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE credits SET job=$1 WHERE id=$2', [this.job, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Fetch the latest data from the database and refresh this object's properties.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} Returns true on success, false on failure,
     *          e.g. row with {@link this.id} does not exist.
     */
    async fetch() {
        const response = await pool.query('SELECT job FROM credits WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length === 0)
            return false;
        this.job = response.rows[0].job;
        return true;
    }

    /**
     * Delete this Credit from the database.
     * @throws PostgreSQL error
     * @returns {Promise<void>}
     */
    async delete() {
        const prevCredit = await this.getPreviousCredit();
        // Update credits which this credit appears before to instead appear after this credit's appearAfter.
        // E.g., if you have a chain A -> B -> C, when B is removed, relink the credits to be A -> C.
        await pool.query('UPDATE credits SET appears_after=$1 WHERE appears_after=$2',
            [prevCredit == null ? prevCredit : prevCredit.id, this.id]);
        await pool.query('DELETE FROM credits WHERE id=$1', [this.id]);
    }

    /**
     * Get the Person whom this Credit belongs to and is acknowledging the contributions of.
     * @returns {Promise<Person|null>} The Person, or null if it does not exist.
     * @throws PostgreSQL error
     */
    async getPerson() {
        const idResponse = await pool.query('SELECT person FROM credits WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].person == null) {
            return null;
        }
        return await Person.getPersonFromId(idResponse.rows[0].person);
    }

    /**
     * Set the person {@link Person} that this Credit is acknowledging.
     * @param person {Person|number} The Person to set to be the owner of this Credit, or their unique ID.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setPerson(person) {
        const id = person instanceof Person ? person.id : person;
        const response = await pool.query('UPDATE credits SET person=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the Production which this Credit is for.
     * @returns {Promise<Production|null>} The Production, or null if it does not exist.
     * @throws PostgreSQL error
     */
    async getProduction() {
        const idResponse = await pool.query('SELECT production FROM credits WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].production == null) {
            return null;
        }
        return await Production.getProductionFromId(idResponse.rows[0].production);
    }

    /**
     * Set the Production {@link Production} that this Credit belongs to.
     * @param production {Production|number} The Production to set this Credit to belong to, or its unique ID.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setProduction(production) {
        const id = production instanceof Production ? production.id : production;
        const response = await pool.query('UPDATE credits SET production=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the credit which this credit appears after in a list. When a production's credits are all displayed,
     * this credit should be displayed after the credit returned by this method.
     * @returns {Promise<Credit|null>} The credit to display before this credit, or null if it does not exist.
     * @throws PostgreSQL error
     */
    async getPreviousCredit() {
        const idResponse = await pool.query('SELECT appears_after FROM credits WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].appears_after == null) {
            return null;
        }
        return await Credit.getCreditFromId(idResponse.rows[0].appears_after);
    }

    /**
     * Set the credit which this credit appears after in a list.
     * @param newCredit {Credit|number|null} Previous credit to update this credit to have, or a credit's ID. The
     * previous credit is the credit that sequentially appears before this one when all of a production's credits are
     * listed out. Pass null if you wish to remove this credit's previous node.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setPreviousCredit(newCredit) {
        const id = newCredit == null ? null : newCredit instanceof Credit ? newCredit.id : newCredit;
        const response = await pool.query('UPDATE credits SET appears_after=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get a credit from the database, given it's unique ID.
     * @param id {number} ID of the credit to fetch.
     * @returns {Promise<Credit|null>} The fetched credit, or null if the credit does not exist.
     * @throws PostgreSQL error
     */
    static async getCreditFromId(id) {
        if(id == null)
            return null;
        const credit = new Credit(id);
        if(await credit.fetch()) {
            return credit;
        }
        return null;
    }

    /**
     * Fetch all the credits that belong to a given production.
     * @param production {Production|number} The production to fetch credits for, or the production's ID.
     * @returns {Promise<[Credit]>} Array of credits for the given production.
     */
    static async getCreditsForProduction(production) {
        const id = production instanceof Production ? production.id : production;
        const response = await pool.query('SELECT id,job FROM credits WHERE production = $1', [id]);
        const credits = [];
        for(let i = 0; i < response.rows.length; i++) {
            const credit = new Credit(response.rows[i].id);
            credit.job = response.rows[i].job;
            credits.push(credit);
        }
        return credits;
    }

    /**
     * Create a new Credit for a specified production and person and add it to the database.
     * @param production {Production|number} The Production to add this Credit for, or it's ID. Required
     * @param person {Person|number} The person the new Credit should belong to, or it's ID. Required
     * @param job {string} The job this person did at this production. Required
     * @param appearsAfter {Credit|number|null|undefined} The Credit which this Credit should appear after sequentially
     * @returns {Promise<Credit>} The newly created Credit
     * @throws PostgreSQL error
     */
    static async createCredit(production, person, job,
                              appearsAfter= null) {
        production = production instanceof Production ? production : await Production.getProductionFromId(production);
        person = person instanceof Person ? person : await Person.getPersonFromId(person);
        appearsAfter = appearsAfter instanceof Credit ? appearsAfter : await Credit.getCreditFromId(appearsAfter);

        const response = await pool.query('INSERT INTO credits (production, person, job, appearsAfter) VALUES ' +
            '($1, $2, $3, $4) RETURNING *', [production.id, person.id, job, appearsAfter.id]);

        const credit = new Credit(response.rows[0].id);
        credit.job = response.rows[0].job;
        return credit;

    }
}

module.exports = { Credit };
