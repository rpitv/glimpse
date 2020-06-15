
const PermissionLevels = Object.freeze({
	PUBLIC: -100,
	USER: 0,
	ADMIN: 100
})

class PermissionTools {

	static assertIsAdmin(user, superAccess) {
		if(superAccess) {
			return;
		}
		if(!user || user.permissionLevel < PermissionLevels.ADMIN) {
			throw new PermissionError("You don't have permission to access this!");
		}
	}

	static isAdmin(user) {
		// noinspection RedundantIfStatementJS
		if (!user || user.permissionLevel < PermissionLevels.ADMIN)
			return false
		return true
	}

	static assertIsUser(user, superAccess) {
		if(superAccess) {
			return;
		}
		if(!user || user.permissionLevel < PermissionLevels.USER) {
			throw new PermissionError("You don't have permission to access this!");
		}
	}

	static assertHasSuperAccess(user, superAccess) {
		if(!superAccess)
			throw new PermissionError("You don't have permission to access this!");
	}
}

class PermissionError extends Error {

	constructor(message) {
		super(message);
		this.name = "PermissionError";
	}
}

module.exports = { PermissionTools, PermissionError, PermissionLevels }
