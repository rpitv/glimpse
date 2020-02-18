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
}

module.exports = { Video, VideoTypes };
