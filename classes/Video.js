const { pool } = require('../db-pool');

const VideoTypes = {
    MPEG_DASH: 0,
    RTMP: 1,
    EMBED: 2

};

/**
 * Video class
 * A Video is some form of recorded content that is streamable to the browser. Multiple different video formats/types
 * exist, and this class mainly exists to connect streamable content to its display name and content type.
 * Since there are different formats supported, and each format may have different metadata associated with it,
 * non-relational data is stored in {@link this.data}. However, all videos must have AT LEAST a name {@link this.name}
 * and a type {@link this.videoType}.
 * @see VideoTypes
 */
class Video {

    /**
     * Instantiate a new instance of Video with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this production, use {@link getVideoFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getVideoFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Save any changes made to this Video's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
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
     * @returns {Promise<void>}
     * @throws PostgreSQL error
     */
    async delete() {
        await pool.query('DELETE FROM production_videos WHERE video=$1', [this.id]);
        await pool.query('DELETE FROM videos WHERE id=$1', [this.id]);
    }

    /**
     * Get the total number of videos in the database.
     * @returns {Promise<number>} The total number of videos in the database.
     * @throws PostgreSQL error
     */
    static async getVideoCount() {
        const response = await pool.query('SELECT COUNT(id) FROM videos');
        return response.rows[0].count;
    }

    /**
     * Get all videos from the database.
     * @returns {Promise<[Video]>} A list of videos
     * @throws PostgreSQL error
     */
    static async getAllVideos() {
        const response = await pool.query('SELECT id, name, video_type, data FROM videos ORDER BY name ASC, id ASC');
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
     * @param perPage {number} The total number of videos to respond with per page. If less than or equal to 0, all
     * videos are returned.
     * @param lastVideoIndex {number} The index position of the last video in the list from the last time this method
     * was called. If lastVideoIndex < -1 then this value is defaulted to -1.
     * @returns {Promise<[Video]>} An array of videos.
     * @throws PostgreSQL error
     */
    static async getPaginatedVideos(perPage, lastVideoIndex) {
        // Go back to page one if an invalid lastVideoIndex is provided.
        if(lastVideoIndex == null || lastVideoIndex < -1)
            lastVideoIndex = -1;
        // Return all images if no item count per page is provided.
        if(perPage == null || perPage <= 0)
            return (await this.getAllVideos()).slice(lastVideoIndex + 1);

        const response = await pool.query('SELECT id, name, video_type, data FROM videos ' +
            'ORDER BY name ASC, id ASC LIMIT $1 OFFSET $2', [perPage, lastVideoIndex + 1]);
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
     * Create a new Video and add it to the database.
     * TODO Separate this method into a number of other methods for each video type.
     * @param name {string} The name of this video - required
     * @param videoType {VideoTypes} The type of video this video is - required
     * @param data {object | null} The video data this Video contains. Does not follow a schema at the moment.
     * @returns {Promise<Video>} The new Video object
     * @throws PostgreSQL error
     */
    static async createVideo(name, videoType, data = {}) {
        const response = await pool.query('INSERT INTO videos (name, video_type, data) VALUES ($1, $2, $3) RETURNING *',
            [name, videoType, data]);
        const video = new Video(response.rows[0].id);
        video.name = response.rows[0].name;
        video.videoType = response.rows[0].video_type;
        video.data = response.rows[0].data;
        return video;
    }
}

module.exports = { Video, VideoTypes };
