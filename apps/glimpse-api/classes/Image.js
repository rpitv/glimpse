const { pool } = require('../util/db-pool');
const fs = require('fs-extra');
const sharp = require('sharp');
const crypto = require('crypto');
const { PermissionTools } = require('../util/Permissions');
const { Search } = require('../util/Search')

const MAX_IMAGE_SIZE = 10000000; // 10MB
const PERMITTED_FILETYPES = ["png", "jpeg", "jpg", "jfif", "gif", "webp"];
const PERMITTED_MIMETYPES = ["image/png", "image/gif", "image/jpeg", "image/webp"];

function ImageModelFactory(SEEKER, SUPER_ACCESS) {

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
         * Requires ADMIN permission
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         * @returns {Promise<boolean>} True on successful save, false otherwise
         */
        async save() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('UPDATE images SET name=$1, link=$2, added=$3 WHERE id=$4', [
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
         * Requires ADMIN permission
         * @returns {Promise<void>}
         * @throws {PermissionError} Insufficient permissions
         * @throws PostgreSQL error
         */
        async delete() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
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
         * @param searchCtx {String} Search context provided by the user. This context can be passed to a parser, which
         * will provide limitations on the search query. searchCtx defaults to an empty string.
         * @returns {Promise<[Image]>} An array of images.
         * @throws PostgreSQL error
         */
        static async getPaginatedImages(perPage, lastImageIndex, searchCtx) {
            // Go back to page one if an invalid lastImageIndex is provided.
            if(lastImageIndex == null || lastImageIndex < -1)
                lastImageIndex = -1;
            // Default to 20 items per page
            if(perPage == null || perPage <= 0)
                perPage = 20

            // Default searchCtx is blank
            let search = new Search(searchCtx || '')
            if (search.count() > 10) {
                throw new Error('Please use less than 10 search terms.')
            }
            const searchClause = search.buildSQL([{
                name: 'id',
                type: Number
            },{
                name: 'link',
                type: String
            },{
                name: 'name',
                type: String
            }
            ])

            const paramArray = search.getParamArray()

            const response = await pool.query('SELECT id, name, link, added FROM images ' + searchClause +
                ` ORDER BY name ASC, added ASC, id ASC LIMIT $${paramArray.length + 1} 
                OFFSET $${paramArray.length + 2}`,
                [...paramArray, perPage, lastImageIndex + 1]);
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
         * Requires ADMIN permission
         * @param name {string} Name of the image. Required
         * @param file {File} File stream of the image to upload. Required
         * @returns {Promise<Image>} The newly uploaded image
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async uploadImage(name, file) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);

            // Enforce file types
            const splitFileName = file.filename.split('.');
            const fileType = splitFileName.pop();
            if(!PERMITTED_MIMETYPES.includes(file.mimetype.toLowerCase()) ||
                !PERMITTED_FILETYPES.includes(fileType.toLowerCase())) {
                throw new Error("Invalid image format! PNG, JPG, JFIF, JPEG, GIF, and WEBP are permitted.")
            }

            // Image width & height are set temporarily to 0 but are modified by the metadata processor
            let width = 0;
            let height = 0;

            // Validate & get metadata
            await new Promise((resolve, reject) => {
                const readStream = file.createReadStream();
                const metadataFetch = sharp();
                metadataFetch.metadata()
                    .then(info => {
                        width = info.width;
                        height = info.height;

                        // Enforce max image sze
                        if(info.size > MAX_IMAGE_SIZE) {
                            reject(new Error("Image too big! Max image size is " + MAX_IMAGE_SIZE / 1000000 + " MB."));
                        }
                        // Enforce file types (again) - Might be unnecessary
                        if(!PERMITTED_FILETYPES.includes(info.format)) {
                            reject(new Error("Invalid image format! PNG, JPG, JPEG, JFIF, GIF, and WEBP are permitted."));
                        }
                        resolve();
                    });

                readStream.on('error', reject);
                readStream
                    .pipe(metadataFetch)
                    .on('error', reject);
            });

            const newFileName = Date.now() + "-" + SEEKER.email.split('@')[0] +
                crypto.randomBytes(6).toString('hex'); // added 12 crypto chars for noise

            // Image transformer
            const transformer = sharp()
                // Resize image to 100% sanitize
                .resize(width + 1, height + 1)
                .resize(width, height);

            // Transform image & save it
            const globalLink = "/static/uploads/" + newFileName + "." + fileType;
            const localLink = "." + globalLink;
            await fs.createFile(localLink);
            const writeStream = fs.createWriteStream(localLink);
            const readStream = file.createReadStream();
            await new Promise((resolve, reject) => {
                readStream.on('error', reject);
                readStream
                    .pipe(transformer)
                    .pipe(writeStream)
                    .on('error', reject)
                    .on('finish', resolve);
            });

            return this.createImage(name, globalLink);
        }

        /**
         * Create a new Image and add it to the database.
         * Requires ADMIN permission
         * @param name {string} Name of the image. Required
         * @param link {string} URL to the image. Required
         * @returns {Promise<Image>} The newly created image
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async createImage(name, link) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('INSERT INTO images (name, link) VALUES ($1, $2) RETURNING *', [name, link]);
            const img = new Image(response.rows[0].id);
            img.name = response.rows[0].name;
            img.link = response.rows[0].link;
            img.added = response.rows[0].added;
            return img;
        }
    }

    return Image;
}

const Image = ImageModelFactory(null, true);

module.exports = { Image, ImageModelFactory };
