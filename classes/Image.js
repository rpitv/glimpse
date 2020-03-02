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
        if(response.rows.length === 0) {
            return false;
        }
        this.name = response.rows[0].name;
        this.link = response.rows[0].link;
        this.added = response.rows[0].added;
        return true;
    }

    /**
     * Delete this Image from the database. Also removes any image associations/thumbnails with productions.
     * @returns {Promise<void>}
     * @throws PostgreSQL error
     */
    async delete() {
        await pool.query('UPDATE productions SET thumbnail=null WHERE thumbnail=$1', [this.id]);
        await pool.query('DELETE FROM production_images WHERE image=$1', [this.id]);
        await pool.query('DELETE FROM images WHERE id=$1', [this.id]);
    }

    /**
     * Get the total number of images in the database.
     * @returns {Promise<number>} The total number of images in the database.
     * @throws PostgreSQL error
     */
    static async getImageCount() {
        const response = await pool.query('SELECT COUNT(id) FROM images');
        return response.rows[0].count;
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

    /**
     * Get all images from the database
     * @returns {Promise<[Image]>} A list of images
     * @throws PostgreSQL error
     */
    static async getAllImages() {
        const response = await pool.query('SELECT id, name, link, added FROM images ' +
            'ORDER BY name ASC, added ASC, id ASC');
        const images = [];
        for(let i = 0; i < response.rows.length; i++) {
            const img = new Image(response.rows[i].id);
            img.name = response.rows[i].name;
            img.link = response.rows[i].link;
            img.added = response.rows[i].added;
            images.push(img);
        }
        return images;
    }

    /**
     * Get a subset list of all images in a paginated manner.
     * @param perPage {number} The total number of images to respond with per page. If less than or equal to 0, all
     * images are returned.
     * @param lastImageIndex {number} The index position of the last image in the list from the last time this method
     * was called. If lastImageIndex < -1 then this value is defaulted to -1.
     * @returns {Promise<[Image]>} An array of images.
     * @throws PostgreSQL error
     */
    static async getPaginatedImages(perPage, lastImageIndex) {
        // Go back to page one if an invalid lastImageIndex is provided.
        if(lastImageIndex == null || lastImageIndex < -1)
            lastImageIndex = -1;
        // Return all images if no item count per page is provided.
        if(perPage == null || perPage <= 0)
            return (await this.getAllImages()).slice(lastImageIndex + 1);

        const response = await pool.query('SELECT id, name, link, added FROM images ' +
            'ORDER BY name ASC, added ASC, id ASC LIMIT $1 OFFSET $2', [perPage, lastImageIndex + 1]);
        const images = [];
        for(let i = 0; i < response.rows.length; i++) {
            const img = new Image(response.rows[i].id);
            img.name = response.rows[i].name;
            img.link = response.rows[i].link;
            img.added = response.rows[i].added;
            images.push(img);
        }
        return images;
    }

    /**
     * Upload a new Image to the server, and then create a new image in the database.
     * @param name {string} Name of the image. Required
     * @param file {Stream} File stream of the image to upload. Required
     * @returns {Promise<Image>} The newly uploaded image
     * @throws PostgreSQL error
     */
    static async uploadImage(name, file) {
        // TODO
        console.warn('This method has not yet been implemented.');
    }

    /**
     * Create a new Image and add it to the database.
     * @param name {string} Name of the image. Required
     * @param link {string} URL to the image. Required
     * @returns {Promise<Image>} The newly created image
     * @throws PostgreSQL error
     */
    static async createImage(name, link) {
        const response = await pool.query('INSERT INTO images (name, link) VALUES ($1, $2) RETURNING *', [name, link]);
        const img = new Image(response.rows[0].id);
        img.name = response.rows[0].name;
        img.link = response.rows[0].link;
        img.added = response.rows[0].added;
        return img;
    }
}

module.exports = { Image };
