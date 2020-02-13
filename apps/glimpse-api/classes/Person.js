const { pool } = require('../db-pool');

/**
 * Person class
 * People are not necessarily an account which can log into the website (that's {@link User}), but a record
 * of someone's identity in the database. People could or could not be a member, and could or could not have
 * a linked {@link User} account. The main goal of this class is to centralize and document someone's metadata,
 * such as their name, class year, etc.
 *
 * Requires that {@link this.id} be non-null.
 */
class Person {

    /**
     * Instantiate a new instance of Person with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this person, use {@link getPersonFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getPersonFromId} instead.
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
        const response = await pool.query('SELECT first_name,last_name,preferred_name,class_year FROM people ' +
            'WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length === 0) {
            return false;
        }
        this.firstName = response.rows[0].first_name;
        this.lastName = response.rows[0].last_name;
        this.preferredName = response.rows[0].preferred_name;
        this.classYear = response.rows[0].class_year;
        return true;
    }

    /**
     * Save any changes made to this person's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE people SET first_name=$1, last_name=$2, preferred_name=$3, ' +
            'class_year=$4 WHERE id=$5', [
            this.firstName,
            this.lastName,
            this.preferredName,
            this.classYear,
            this.id
        ]);
        return response && response.rowCount > 0;
    }

    /**
     * Create a new person and add them to the database
     * @param firstName {string} This person's first name - Required
     * @param lastName {string} This person's last name
     * @param preferredName {string} This person's preferred name (i.e. nickname)
     * @param classYear {number} This person's class year, i.e. the year they graduate
     * @returns {Promise<Person>} the new Person object
     * @throws PostgreSQL error
     */
    static async createPerson(firstName, lastName = null, preferredName = null,
                       classYear = new Date().getFullYear() + 4) {
        const response = await pool.query('INSERT INTO people (first_name, last_name, preferred_name, class_year) ' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, preferredName, classYear]);

        const person = new Person(response.rows[0].id);
        person.firstName = response.rows[0].first_name;
        person.lastName = response.rows[0].last_name;
        person.preferredName = response.rows[0].preferred_name;
        person.classYear = response.rows[0].class_year;
        return person;
    }

    /**
     * Get a person from the database, given their unique ID.
     * @param id {number} ID to search for in the database
     * @returns {Promise<null|Person>} The fetched person, or null if the person does not exist.
     * @throws PostgreSQL error
     */
    static async getPersonFromId(id) {
        const person = new Person(id);
        if(await person.fetch()) {
            return person;
        }

        return null;
    }

    /**
     * Get all People in the database, active members or not.
     * @returns {Promise<[Person]>} All People
     */
    static async getAllPeople() {
        const response = await pool.query('SELECT id, first_name, last_name, preferred_name, class_year FROM people');
        const people = [];
        for(let i = 0; i < response.rows.length; i++) {
            const person = new Person(response.rows[i].id);
            person.firstName = response.rows[i].first_name;
            person.lastName = response.rows[i].last_name;
            person.preferredName = response.rows[i].preferred_name;
            person.classYear = response.rows[i].class_year;
            people.push(person);
        }
        return people;
    }

    /**
     * Get all People in the club which are active members, i.e. they have an active Role in the club.
     * @returns {Promise<[Person]>} Array of members in the club.
     */
    static async getAllMembers() {
        const people = await this.getAllPeople();
        const members = [];
        for(let i = 0; i < people.length; i++) {
            if(await people[i].isMember()) {
                members.push(people[i]);
            }
        }
        return members;
    }

    /**
     * Get whether this person is currently a member or not. A person is a member when they have a role
     * which has a start date earlier than now and an end date which is null or later than now.
     * @returns {Promise<boolean>} True if this person has an active role, false otherwise.
     * @throws PostgreSQL error
     */
    async isMember() {
        const result = await pool.query('SELECT * FROM roles ' +
            'WHERE person=$1 AND start_date < NOW() AND (end_date IS NULL OR end_date > NOW()) LIMIT 1', [this.id]);
        return (result.rows.length > 0);
    }
}

module.exports = { Person };
