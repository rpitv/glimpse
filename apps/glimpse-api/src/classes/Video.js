const { pool } = require('../util/db-pool');
const { PermissionTools } = require('../util/Permissions');
const { Search } = require('../util/Search')

const VideoTypes = Object.freeze({
    RTMP: "RTMP", // Soon to be deprecated
    EMBED: "EMBED"

});

function VideoModelFactory(SEEKER, SUPER_ACCESS) {

    /**
     * Video class
     * A Video is some form of recorded content that is streamable to the browser. Multiple different video formats/types
     * exist, and this class mainly exists to connect streamable content to its display name and content type.
     * Since there are different formats supported, and each format may have different metadata associated with it,
     * non-relational data is stored in {@link this.data}. However, all videos must have AT LEAST a name {@link this.name}
     * and a type {@link this.videoType}. You should never edit {@link this.data} without asserting the video's type first.
     * @see VideoTypes
     */
    class Video {

        /**
         * Instantiate a new instance of Video with the provided ID. Does not fetch data.
         * If you want to get the appropriate data for this production, use {@link getVideoFromId} or
         * {@link fetch}. If you call {@link save} before calling one of these two methods,
         * {@link save} will attempt to write "undefined" to all fields. Avoid using this
         * constructor directly, and use {@link getVideoFromId} instead.
         *
         * @param id {number} Numerical ID to instantiate with.
         */
        constructor(id) {
            this.id = id;
        }

        /**
         * Save any changes made to this Video's "primitives" to the database
         * Simply pushes an update to the database to rows where id == this.id
         * Requires ADMIN permission
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         * @returns {Promise<boolean>} True on successful save, false otherwise
         */
        async save() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('UPDATE videos SET name=$1, data=$2, video_type=$3 WHERE id=$4', [
                this.name,
                this.data,
                this.videoType,
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
            const response = await pool.query('SELECT name,video_type,data FROM videos WHERE id=$1 LIMIT 1', [this.id]);
            if(response.rows.length === 0)
                return false;

            this.data = response.rows[0].data;
            this.name = response.rows[0].name;
            this.videoType = response.rows[0].video_type;
            return true;
        }

        /**
         * Delete this video from the database. Also removes any associations pointing to this video in Productions.
         * Requires ADMIN permission
         * @returns {Promise<void>}
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        async delete() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            await pool.query('DELETE FROM production_videos WHERE video=$1', [this.id]);
            await pool.query('DELETE FROM videos WHERE id=$1', [this.id]);
        }

        /**
         * Get the total number of videos in the database.
         * @param searchCtx {String} Search context provided by the user. This context can be passed to a parser, which
         * will provide limitations on the search query. searchCtx defaults to an empty string.
         * @param advancedSearch {boolean} Flag for whether the search in searchCtx is an advanced search or not.
         * @returns {Promise<number>} The total number of videos in the database.
         * @throws PostgreSQL error
         */
        static async getVideoCount(searchCtx, advancedSearch) {
            const search = new Search(searchCtx || '', advancedSearch)

            if (search.count() > 10) {
                throw new Error('Please use less than 10 search terms.')
            }
            const searchClause = search.buildSQL([{
                name: 'id',
                type: Number
            },{
                name: 'name',
                type: String
            }
            ])

            const paramArray = search.getParamArray()
            const response = await pool.query('SELECT COUNT(id) FROM (SELECT id FROM videos ' + searchClause + ') AS derived;',
                paramArray);
            return response.rows[0].count;
        }

        /**
         * Get all videos from the database.
         * Requires ADMIN permission
         * @returns {Promise<[Video]>} A list of videos
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async getAllVideos() {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            const response = await pool.query('SELECT id, name, video_type, data FROM videos ORDER BY name, id');
            const videos = [];
            for(let i = 0; i < response.rows.length; i++) {
                const video = new Video(response.rows[i].id);
                video.name = response.rows[i].name;
                video.videoType = response.rows[i].video_type;
                video.data = response.rows[i].data;
                videos.push(video);
            }
            return videos;
        }

        /**
         * Get a subset list of all videos in a paginated manner.
         * Requires ADMIN permission
         * @param perPage {number} The total number of videos to respond with per page. If less than or equal to 0, all
         * videos are returned.
         * @param lastVideoIndex {number} The index position of the last video in the list from the last time this method
         * was called. If lastVideoIndex < -1 then this value is defaulted to -1.
         * @param searchCtx {String} Search context provided by the user. This context can be passed to a parser, which
         * will provide limitations on the search query. searchCtx defaults to an empty string.
         * @param advancedSearch {boolean} Flag for whether the search in searchCtx is an advanced search or not.
         * @returns {Promise<[Video]>} An array of videos.
         * @throws PostgreSQL error
         * @throws {PermissionError} Insufficient permissions
         */
        static async getPaginatedVideos(perPage, lastVideoIndex, searchCtx, advancedSearch) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            // Go back to page one if an invalid lastVideoIndex is provided.
            if(lastVideoIndex == null || lastVideoIndex < -1)
                lastVideoIndex = -1;
            // Default per page count to 20
            if(perPage == null || perPage <= 0)
                perPage = 20

            // Default searchCtx is blank
            let search = new Search(searchCtx || '', advancedSearch)
            if (search.count() > 10) {
                throw new Error('Please use less than 10 search terms.')
            }
            const searchClause = search.buildSQL([{
                name: 'id',
                type: Number
            },{
                name: 'name',
                type: String
            }
            ])
            const paramArray = search.getParamArray()

            const response = await pool.query('SELECT id, name, video_type, data FROM videos ' + searchClause +
                ` ORDER BY name ASC, id ASC LIMIT $${paramArray.length + 1} OFFSET $${paramArray.length + 2}`,
                [...paramArray, perPage, lastVideoIndex + 1]);
            const videos = [];
            for(let i = 0; i < response.rows.length; i++) {
                const video = new Video(response.rows[i].id);
                video.name = response.rows[i].name;
                video.videoType = response.rows[i].video_type;
                video.data = response.rows[i].data;
                videos.push(video);
            }
            return videos;
        }

        /**
         * Unpack the data in {@link this.data} to comply with the more structured system in GraphQL.
         * The reason for this design choice is unfortunately Javascript classes are kind of wonky...
         * I believe it would be difficult to maintain an inheritance-based structure for Videos in JS.
         * Could always change later.
         */
        unpackForClient() {
            if(this.videoType === VideoTypes.EMBED || this.videoType === VideoTypes.RTMP) {
                this.url = this.data.url;
            }
        }

        /**
         * Get a Video from the database, given its unique ID.
         * @param id {number} ID to search for in the database
         * @returns {Promise<null|Video>} The fetched Video, or null if the Video does not exist.
         * @throws PostgreSQL error
         */
        static async getVideoFromId(id) {
            if(id == null)
                return null;
            const video = new Video(id);
            if(await video.fetch())
                return video;
            return null;
        }

        /**
         * Create a new embedded Video and add it to the database. Embedded videos are usually YouTube videos.
         * Requires ADMIN permission
         * @param name {string} The name of this video - required
         * @param url {string} The (probably external) url to embed in an iframe.
         *          Required and must start with "http://" or "https://"
         * @returns {Promise<Video>} The new Video object
         * @throws PostgreSQL error
         * @throws Error missing 'url' parameter
         * @throws Error 'url' parameter does not begin with "http://" or "https://"
         * @throws {PermissionError} Insufficient permissions
         */
        static async createEmbedVideo(name, url) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            if(!url) {
                throw new Error("Missing required parameter 'url'!")
            }
            if(!url.match(/^https?:\/\//)) {
                throw new Error("Malformed url: Beginning must match \"https?:\\/\\/\"!")
            }

            const data = { url }
            const response = await pool.query('INSERT INTO videos (name, video_type, data) VALUES ($1, $2, $3) RETURNING *',
                [name, VideoTypes.EMBED, data]);
            const video = new Video(response.rows[0].id);
            video.name = response.rows[0].name;
            video.videoType = response.rows[0].video_type;
            video.data = response.rows[0].data;
            return video;
        }

        /**
         * Create a new RTMP protocol Video and add it to the database. RTMP videos must use a flash-based video player,
         * and as such, this video type will soon be deprecated.
         * Requires ADMIN permission
         * @param name {string} The name of this video - required
         * @param rtmpUrl {string} The URL to the RTMP feed. Required and must begin with "rtmp://".
         * @returns {Promise<Video>} The new Video object
         * @throws PostgreSQL error
         * @throws Error missing 'rtmpUrl' parameter
         * @throws Error 'rtmpUrl' parameter does not begin with "rtmp://"
         * @throws {PermissionError} Insufficient permissions
         */
        static async createRTMPVideo(name, rtmpUrl) {
            PermissionTools.assertIsAdmin(SEEKER, SUPER_ACCESS);
            if(!rtmpUrl) {
                throw new Error("Missing required parameter 'url'!")
            }
            if(!rtmpUrl.startsWith("rtmp://")) {
                throw new Error("Malformed rtmpUrl: Must begin with \"rtmp://\"!")
            }

            const data = { url: rtmpUrl }
            const response = await pool.query('INSERT INTO videos (name, video_type, data) VALUES ($1, $2, $3) RETURNING *',
                [name, VideoTypes.RTMP, data]);
            const video = new Video(response.rows[0].id);
            video.name = response.rows[0].name;
            video.videoType = response.rows[0].video_type;
            video.data = response.rows[0].data;
            return video;
        }
    }

    return Video;
}

const Video = VideoModelFactory(null, true);

module.exports = { Video, VideoTypes, VideoModelFactory };
