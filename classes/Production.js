const { pool } = require('../db-pool');
const { Image } = require('./Image');
const { Category } = require('./Category');
const { User } = require('./User');
const { Video } = require('./Video');

/**
 * Production class
 * A Production is an event of some sort which was filmed or documented by the club. Productions are not required to
 * have associated Images and Videos, however most will have at least one. All productions can have a creator, a name,
 * a description, a start time, a create time, a visibility status, a list of associated Images, a list of associated
 * Videos, a thumbnail, and a Category. Of those, the creator, name, start time, and creation time are required while
 * all others are optional.
 * Visibility status is overridden if the User viewing is an admin.
 */
class Production {

    /**
     * Instantiate a new instance of Production with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this production, use {@link getProductionFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getProductionFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Save any changes made to this productions's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query("UPDATE productions SET name=$1, description=$2, " +
            "start_time=$3, create_time=$4, visible=$5 WHERE id=$6", [this.name, this.description,
        this.startTime, this.createTime, this.visible, this.id]);

        return response && response.rowCount > 0;
    }

    /**
     * Fetch the latest data from the database and refresh this object's properties.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} Returns true on success, false on failure,
     *          e.g. row with {@link this.id} does not exist.
     */
    async fetch() {
        const response = await pool.query('SELECT name,description,start_time,create_time,visible FROM ' +
            'productions WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length === 0)
            return false;

        this.name = response.rows[0].name;
        this.description = response.rows[0].description;
        this.startTime = response.rows[0].start_time;
        this.createTime = response.rows[0].create_time;
        this.visible = !!response.rows[0].visible;
        return true;
    }

    /**
     * Delete this production from the database. Also deletes any video/image associations and credits.
     * @throws PostgreSQL error
     * @returns {Promise<void>}
     */
    async delete() {
        await pool.query('DELETE FROM production_videos WHERE production=$1', [this.id]);
        await pool.query('DELETE FROM production_images WHERE production=$1', [this.id]);
        await pool.query('DELETE FROM credits WHERE production=$1', [this.id]);
        await pool.query('DELETE FROM productions WHERE id=$1', [this.id]);
    }

    /**
     * Get this production's thumbnail.
     * @throws PostgreSQL error
     * @returns {Promise<Image|null>} This production's thumbnail, or null if it does not exist.
     */
    async getThumbnail() {
        const idResponse = await pool.query('SELECT thumbnail FROM productions WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].thumbnail == null)
            return null;
        return Image.getImageFromId(idResponse.rows[0].thumbnail);
    }

    /**
     * Set this production's thumbnail to some image.
     * @param image {Image|null|number} The image to set this production's thumbnail to,
     * or null to remove the thumbnail.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     */
    async setThumbnail(image) {
        const id = image == null ? null : image instanceof Image ? image.id : image;
        const response = await pool.query('UPDATE productions SET thumbnail=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the category that this production belongs to.
     * @throws PostgreSQL error
     * @returns {Promise<Category|null>} The category that this production belongs to, or null if it has no category.
     */
    async getCategory() {
        const idResponse = await pool.query('SELECT category FROM productions WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].category == null)
            return null;
        return Category.getCategoryFromId(idResponse.rows[0].category);
    }

    /**
     * Set what category this production belongs to.
     * @param category {Category|null|number} The category to set this production to belong to, or
     * null to remove the category.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setCategory(category) {
        const id = category == null ? null : category instanceof Category ? category.id : category;
        const response = await pool.query('UPDATE productions SET category=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the creator User of this production.
     * @throws PostgreSQL error
     * @returns {Promise<User>} The user that created this production
     */
    async getCreator() {
        const idResponse = await pool.query('SELECT createdBy FROM productions WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0)
            return null;
        return User.getUserFromId(idResponse.rows[0].createdBy);
    }

    /**
     * Set the creator User of this production.
     * @param user {User|number} The user that created this production. Should not be null.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     */
    async setCreator(user) {
        const id = user instanceof User ? user.id : user;
        const response = await pool.query('UPDATE productions SET createdBy=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get all of the images/photos taken during or related to this production.
     * @throws PostgreSQL error
     * @returns {Promise<[Image]>} An array of all the images related to this production.
     */
    async getProductionImages() {
        const response = await pool.query('SELECT image FROM production_images WHERE production=$1', [this.id]);

        const images = [];
        for(let i = 0; i < response.rows.length; i++) {
            images.push(await Image.getImageFromId(response.rows[i].image));
        }
        return images;
    }

    /**
     * Add an image to this production's related images.
     * @param image {Image|number} The image to add, or it's ID. Should not be null.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     */
    async addProductionImage(image) {
        if(image instanceof Image)
            image = image.id;
        const response = await pool.query('INSERT INTO production_images (production, image) VALUES ($1, $2) ' +
            'RETURNING *', [this.id, image]);

        return response && response.rows.length > 0;
    }

    /**
     * Remove an image from a production's associated images.
     * @param image {Image|number} The image to remove, or it's ID. Should not be null.
     * @throws PostgreSQL error
     * @returns {Promise<void>}
     */
    async removeProductionImage(image) {
        if(image instanceof Image)
            image = image.id;
        await pool.query('DELETE FROM production_images WHERE image=$1 AND production=$2',
            [image, this.id]);
    }

    /**
     * Get all the videos that should be displayed with this production.
     * @throws PostgreSQL error
     * @returns {Promise<[Video]>} An array of all the videos related to this production.
     */
    async getProductionVideos() {
        const response = await pool.query('SELECT video FROM production_videos WHERE production=$1', [this.id]);

        const videos = [];
        for(let i = 0; i < response.rows.length; i++) {
            videos.push(await Video.getVideoFromId(response.rows[i].video));
        }
        return videos;
    }

    /**
     * Add a video to a production's associated videos list.
     * @param video {Video|number} The Video to add, or it's ID. Should not be null.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     */
    async addProductionVideo(video) {
        if(video instanceof Video)
            video = video.id;
        const response = await pool.query('INSERT INTO production_videos (production, video) VALUES ($1, $2) ' +
            'RETURNING *', [this.id, video]);

        return response && response.rows.length > 0;
    }

    /**
     * Remove a video from a production's associated videos list.
     * @param video {Video|number} The Video to remove, or it's ID. Should not be null.
     * @throws PostgreSQL error
     * @returns {Promise<void>}
     */
    async removeProductionVideo(video) {
        if(video instanceof Video)
            video = video.id;
        await pool.query('DELETE FROM production_videos WHERE video=$1 AND production=$2',
            [video, this.id]);
    }

    /**
     * Get the total number of productions in the database.
     * @returns {Promise<number>} The total number of productions in the database.
     * @throws PostgreSQL error
     */
    static async getProductionCount() {
        const response = await pool.query('SELECT COUNT(id) FROM productions');
        return response.rows[0].count;
    }

    static async getAllProductions() {
        const response = await pool.query('SELECT id,name,description,start_time,create_time,visible FROM ' +
            'productions ORDER BY create_time ASC, name ASC, id ASC');
        const productions = [];
        for(let i = 0; i < response.rows.length; i++) {
            const prod = new Production(response.rows[i].id);
            prod.name = response.rows[i].name;
            prod.description = response.rows[i].description;
            prod.startTime = response.rows[i].start_time;
            prod.createTime = response.rows[i].create_time;
            prod.visible = !!response.rows[i].visible;
            productions.push(prod);
        }
        return productions;
    }

    /**
     * Get a subset list of all productions in a paginated manner.
     * @param perPage {number} The total number of productions to respond with per page. If less than or equal to 0, all
     * productions are returned.
     * @param lastProductionIndex {number} The index position of the last production in the list from the last time this
     * method was called. If lastProductionIndex < -1 then this value is defaulted to -1.
     * @returns {Promise<[Production]>} An array of productions.
     * @throws PostgreSQL error
     */
    static async getPaginatedProductions(perPage, lastProductionIndex) {
        // Go back to page one if an invalid lastProductionIndex is provided.
        if(lastProductionIndex == null || lastProductionIndex < -1)
            lastProductionIndex = -1;
        // Return all productions if no item count per page is provided.
        if(perPage == null || perPage <= 0)
            return (await this.getAllProductions()).slice(lastProductionIndex + 1);

        const response = await pool.query('SELECT id, name, description, start_time, create_time, visible, added ' +
            'FROM productions ' +
            'ORDER BY create_time ASC, name ASC, id ASC LIMIT $1 OFFSET $2', [perPage, lastProductionIndex + 1]);
        const productions = [];
        for(let i = 0; i < response.rows.length; i++) {
            const prod = new Production(response.rows[i].id);
            prod.name = response.rows[i].name;
            prod.description = response.rows[i].description;
            prod.startTime = response.rows[i].start_time;
            prod.createTime = response.rows[i].create_time;
            prod.visible = !!response.rows[i].visible;
            productions.push(prod);
        }
        return productions;
    }

    /**
     * Get a production from the database, given it's unique ID.
     * @param id {number} ID of the production to fetch.
     * @returns {Promise<Production|null>} The fetched production, or null if the production does not exist.
     * @throws PostgreSQL error
     */
    static async getProductionFromId(id) {
        if(id == null)
            return null;
        const prod = new Production(id);
        if(await prod.fetch())
            return prod;
        return null;
    }
}

module.exports = { Production };
