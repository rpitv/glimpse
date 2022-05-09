enum PermissionLevels {
    PUBLIC = -100,
    USER = 0,
    ADMIN = 100
}

class PermissionTools {

    static assertIsAdmin(user: User, superAccess: boolean) {
        if (superAccess) {
            return;
        }
        if (!user || user.permissionLevel < PermissionLevels.ADMIN) {
            throw new PermissionError("You don't have permission to access this!");
        }
    }

    static isAdmin(user: User) {
        // noinspection RedundantIfStatementJS
        if (!user || user.permissionLevel < PermissionLevels.ADMIN)
            return false;
        return true;
    }

    static assertIsUser(user: User, superAccess: boolean) {
        if (superAccess) {
            return;
        }
        if (!user || user.permissionLevel < PermissionLevels.USER) {
            throw new PermissionError("You don't have permission to access this!");
        }
    }

    static assertHasSuperAccess(user: User, superAccess: boolean) {
        if (!superAccess)
            throw new PermissionError("You don't have permission to access this!");
    }
}

class PermissionError extends Error {

    constructor(message: string) {
        super(message);
        this.name = "PermissionError";
    }
}

export { PermissionTools, PermissionLevels, PermissionError };
