const { pool } = require('../db-pool');

/**
 * Category class
 * A Category is a way to filter Productions into different topics/genres. Productions are not required to
 * have a Category. Categories must have an ID {@link Category.id} and a name {@Link Category.name}. Categories
 * can also have both a parent Category {@link Category.getParentCategory()} and a previous sibling Category
 * {@link Category.getPreviousCategory()}. These form a tree-linked-list-like structure which allows for specific
 * order customization by the database.
 */
class Category {

    /**
     * Instantiate a new instance of Category with the provided ID. Does not fetch data.
     * If you want to get the appropriate data for this Category, use {@link getCategoryFromId} or
     * {@link fetch}. If you call {@link save} before calling one of these two methods,
     * {@link save} will attempt to write "undefined" to all fields. Avoid using this
     * constructor directly, and use {@link getCategoryFromId} instead.
     * @param id {number} Numerical ID to instantiate with.
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * Save any changes made to this Category's "primitives" to the database
     * Simply pushes an update to the database to rows where id == this.id
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} True on successful save, false otherwise
     */
    async save() {
        const response = await pool.query('UPDATE categories SET name=$1 WHERE id=$2', [this.name, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Fetch the latest data from the database and refresh this object's properties.
     * @throws PostgreSQL error
     * @returns {Promise<boolean>} Returns true on success, false on failure,
     *          e.g. row with {@link this.id} does not exist.
     */
    async fetch() {
        const response = await pool.query('SELECT name FROM categories WHERE id=$1 LIMIT 1', [this.id]);
        if(response.rows.length === 0)
            return false;
        this.name = response.rows[0].name;
        return true;
    }

    /**
     * Delete this Category. If this Category has a parent Category, then all Productions using this Category are
     * updated to use the parent Category. If this Category has no parent Category, then all Productions using this
     * Category are updated to have no Category.
     * @returns {Promise<void>}
     * @throws PostgreSQL error
     */
    async delete() {
        const parent = await this.getParentCategory();
        const prevCategory = await this.getPreviousCategory();
        await pool.query('UPDATE productions SET category=$1 WHERE category=$2',
            [parent == null ? null : parent.id, this.id]);
        await pool.query('UPDATE categories SET parent=$1 WHERE parent=$2',
            [parent == null ? null : parent.id, this.id]);
        await pool.query('UPDATE categories SET appears_after=$1 WHERE appears_after=$2',
            [prevCategory == null ? null : prevCategory.id, this.id]);
        await pool.query('DELETE FROM categories WHERE id=$1', [this.id]);
    }

    /**
     * Get the Category which this Category appears BELOW in a list. When all Categories are displayed,
     * this Category should be displayed BELOW the Category returned by this method.
     * @returns {Promise<Category|null>} The Category to display ABOVE this Category, or null if it does not exist.
     * @throws PostgreSQL error
     */
    async getParentCategory() {
        const idResponse = await pool.query('SELECT parent FROM categories WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].parent == null) {
            return null;
        }
        return await Category.getCategoryFromId(idResponse.rows[0].parent);
    }

    /**
     * Set the Category which this Category appears BELOW in a list.
     * @param newCategory {Category|number|null} Parent Category to update this Category to have, or a Category's ID.
     * The parent Category is the Category that this Category appears below as a child of, when all Categories are
     * displayed. Pas null if you wish to remove this Category's parent node.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setParentCategory(newCategory) {
        const id = newCategory == null ? null : newCategory instanceof Category ? newCategory.id : newCategory;
        const response = await pool.query('UPDATE categories SET parent=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the Category which this Category appears AFTER in a list. When all Categories with the same parent Category
     * are displayed, this Category should be displayed AFTER the Category returned by this method.
     * @returns {Promise<Category|null>} The Category to display BEFORE this Category, or null if it does not exist.
     * @throws PostgreSQL error
     */
    async getPreviousCategory() {
        const idResponse = await pool.query('SELECT appears_after FROM categories WHERE id=$1 LIMIT 1', [this.id]);
        if(idResponse.rows.length === 0 || idResponse.rows[0].appears_after == null) {
            return null;
        }
        return await Category.getCategoryFromId(idResponse.rows[0].appears_after);
    }

    /**
     * Set the Category which this Category appears AFTER in a list of Categories with the same parent Category.
     * @param newCategory {Category|number|null} Previous Category to update this Category to have, or a Category's ID.
     * The previous Category is the Category that sequentially appears before this one when all Categories with the
     * same parent Category are listed out. Pass null if you wish to remove this Category's previous node.
     * @returns {Promise<boolean>} True on successful update, false otherwise.
     * @throws PostgreSQL error
     */
    async setPreviousCategory(newCategory) {
        const id = newCategory == null ? null : newCategory instanceof Category ? newCategory.id : newCategory;
        const response = await pool.query('UPDATE categories SET appears_after=$1 WHERE id=$2', [id, this.id]);
        return response && response.rowCount > 0;
    }

    /**
     * Get the total number of categories in the database.
     * @returns {Promise<number>} The total number of categories in the database.
     * @throws PostgreSQL error
     */
    static async getCategoryCount() {
        const response = await pool.query('SELECT COUNT(id) FROM categories');
        return response.rows[0].count;
    }

    /**
     * Get all categories in the database
     * @returns {Promise<[Category]>} A list of categories
     * @throws PostgreSQL error
     */
    static async getAllCategories() {
        const response = await pool.query('SELECT id,name FROM categories ORDER BY name ASC, id ASC');
        const categories = [];
        for(let i = 0; i < response.rows.length; i++) {
            const category = new Category(response.rows[i].id);
            category.name = response.rows[i].name;
            categories.push(category);
        }
        return categories;
    }

    /**
     * Get a subset list of all categories in a paginated manner.
     * @param perPage {number} The total number of categories to respond with per page. If less than or equal to 0, all
     * productions are returned.
     * @param lastCategoryIndex {number} The index position of the last category in the list from the last time this
     * method was called. If lastCategoryIndex < -1 then this value is defaulted to -1.
     * @returns {Promise<[Production]>} An array of productions.
     * @throws PostgreSQL error
     */
    static async getPaginatedCategories(perPage, lastCategoryIndex) {
        // Go back to page one if an invalid lastCategoryIndex is provided.
        if(lastCategoryIndex == null || lastCategoryIndex < -1)
            lastCategoryIndex = -1;
        // Return all categories if no item count per page is provided.
        if(perPage == null || perPage <= 0)
            return (await this.getAllCategories()).slice(lastCategoryIndex + 1);

        const response = await pool.query('SELECT id, name FROM categories ' +
            'ORDER BY name ASC, id ASC LIMIT $1 OFFSET $2', [perPage, lastCategoryIndex + 1]);
        const categories = [];
        for(let i = 0; i < response.rows.length; i++) {
            const category = new Category(response.rows[i].id);
            category.name = response.rows[i].name;
            categories.push(category);
        }
        return categories;
    }

    /**
     * Get a Category from the database, given it's unique ID.
     * @param id {number} ID of the Category to fetch.
     * @returns {Promise<Category|null>} The fetched Category, or null if the Category does not exist.
     * @throws PostgreSQL error
     */
    static async getCategoryFromId(id) {
        if(id == null)
            return null;
        const category = new Category(id);
        if(await category.fetch()) {
            return category;
        }
        return null;
    }

    /**
     * Create a new Category and add it to the database.
     * @param name {string} The name of this Category
     * @param parent {Category|number|null|undefined} The parent Category of this Category, or it's ID.
     * Defaults to null.
     * @param appearsAfter {Category|number|null|undefined} The Category which this Category appears after
     * sequentially, or it's ID. Defaults to null.
     * @returns {Promise<Category>} The newly created Category
     * @throws PostgreSQL error
     */
    static async createCategory(name, parent = null, appearsAfter = null) {
        const response = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        const category = new Category(response.rows[0].id);
        category.name = response.rows[0].name;
        await category.setParentCategory(parent);
        await category.setPreviousCategory(appearsAfter);
        return category;
    }
}

module.exports = { Category };
