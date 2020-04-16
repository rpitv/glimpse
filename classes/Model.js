
const { CategoryModelFactory } = require('./Category');
const { CreditModelFactory } = require('./Credit');
const { ImageModelFactory } = require('./Image');
const { PersonModelFactory } = require('./Person');
const { ProductionModelFactory } = require('./Production');
const { RoleModelFactory } = require('./Role');
const { UserModelFactory } = require('./User');
const { VideoModelFactory } = require('./Video');

/**
 * Model is an access control class that calls class factories with a given seeker and super access permission.
 * Most of our classes represent literal items in the database, and not concepts. Some users have access to certain
 * parts of these items/classes, while others don't. Enforcing this was not necessarily straightforward, especially
 * without a redesign of the class structure. The best route was decided to be a "Factory" wrapper around all classes.
 * This wrapper takes two parameters (a seeker {User} and super-access flag {boolean}), which can then be used
 * statically inside the class. However, there does not always need to be access control. Some of these methods are used
 * privately on the backend. As a result, each class file also exports the class itself, with no seeker and
 * super-access.
 *
 * This is currently the best option that has been thought of, albeit slightly unintuitive. With that said, it is the
 * modernized version of what Apollo recommends. Some alternatives that were thought about:
 * - Passing in user credentials or authentication into static, or all methods. This would work but it would be a lot of
 *      duplicate volatile code.
 * - Calling a separate static function to save credentials, then call the function we want. This creates a race cond.
 */
class Model {

	/**
	 * Constructor
	 * @param seeker {User|null} The User which is "seeking" data from these classes. Null if there is no user/the
	 *      person accessing the website is not logged in.
	 * @param superAccess {boolean} Whether to bypass ALL authentication checks. Tread carefully. This should only
	 *      be used internally, and not fed as a response to an API call.
	 */
	constructor(seeker, superAccess) {
		this.Category = CategoryModelFactory(seeker, superAccess);
		this.Credit = CreditModelFactory(seeker, superAccess);
		this.Image = ImageModelFactory(seeker, superAccess);
		this.Person = PersonModelFactory(seeker, superAccess);
		this.Production = ProductionModelFactory(seeker, superAccess);
		this.Role = RoleModelFactory(seeker, superAccess);
		this.User = UserModelFactory(seeker, superAccess);
		this.Video = VideoModelFactory(seeker, superAccess);
	}
}

module.exports = { Model };