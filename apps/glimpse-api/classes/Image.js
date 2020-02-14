const { pool } = require('../db-pool');

/**
 * Image class
 * An Image is a wrapper representation of a static or animated image file which can be displayed in an HTML
 * <img> tag. This class simply contains metadata related to an image in the database, such as where it is located
 * in the file system, what it's display name should be, and when it was added to the database.
 */
class Image {

    /**
     * Instantiate a new instance of Image with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this image, use {@link getImageFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getImageFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Save any changes made to this images's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE roles SET name=$1, link=$2, added=$3 WHERE id=$4', [
            this.name,
            this.link,
            this.added,
            this.id
        ]);
        return response && response.rowCount > 0;
    }

    /**
     * Fetch the latest data from the database and refresh this object's properties.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} Returns true on success, false on failure,
     *          e.g. row with {@link this.id} does not exist.
     */
    async fetch() {
        const response = await pool.query('SELECT name,link,added FROM images WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length !== 0) {
            return false;
        }
        this.name = response.rows[0].name;
        this.link = response.rows[0].link;
        this.added = response.rows[0].added;
        return true;
    }

    /**
     * Get an Image from the database, given it's unique ID.
     * @param id {number} Numerical ID of the image in the database.
     * @returns {Promise<Image|null>} An instance of this class with the given image's data, or null if the image
     *          does not exist.
     * @throws PostgreSQL error
     */
    static async getImageFromId(id) {
        const image = new Image(id);
        if(await image.fetch()) {
            return image;
        }
        return null;
    }
}

module.exports = { Image };
