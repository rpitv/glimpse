const { Person } = require('./classes/Person');
const { User } = require('./classes/User');
const { Role } = require('./classes/Role');
const { Image } = require('./classes/Image');
const { Video } = require('./classes/Video');
const { Production } = require('./classes/Production');
const { Category } = require('./classes/Category');
const { Credit } = require('./classes/Credit');
const { DateTimeResolver, JSONResolver } = require('graphql-scalars');


const resolvers = {
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    Query: {
        users: async (obj, args) => {
            return User.getPaginatedUsers(args.pageSize, args.prevUserIndex);
        },
        members: async (obj, args) => {
            return Person.getPaginatedMembers(args.pageSize, args.prevPersonIndex);
        },
        people: async (obj, args) => {
            return Person.getPaginatedPeople(args.pageSize, args.prevPersonIndex);
        },
        images: async (obj, args) => {
            return Image.getPaginatedImages(args.pageSize, args.prevImageIndex);
        },
        videos: async (obj, args) => {
            return Video.getPaginatedVideos(args.pageSize, args.prevVideoIndex);
        },
        productions: async (obj, args) => {
            return Production.getPaginatedProductions(args.pageSize, args.prevProductionIndex);
        },
        categories: async (obj, args) => {
            return Category.getPaginatedCategories(args.pageSize, args.prevCategoryIndex);
        },

        getUser: async (obj, args) => {
            return User.getUserFromId(args.id);
        },
        getPerson: async (obj, args) => {
            return Person.getPersonFromId(args.id);
        },
        getRole: async (obj, args) => {
            return Role.getRoleFromId(args.id);
        },
        getImage: async (obj, args) => {
            return Image.getImageFromId(args.id);
        },
        getVideo: async (obj, args) => {
            return Video.getVideoFromId(args.id);
        },
        getProduction: async (obj, args) => {
            return Production.getProductionFromId(args.id);
        },
        getCategory: async (obj, args) => {
            return Category.getCategoryFromId(args.id);
        },
        getCredit: async (obj, args) => {
            return Credit.getCreditFromId(args.id);
        },

        userCount: async () => {
            return User.getUserCount();
        },
        peopleCount: async () => {
            return Person.getPeopleCount();
        },
        memberCount: async () => {
            return Person.getMemberCount();
        },
        imageCount: async () => {
            return Image.getImageCount();
        },
        videoCount: async () => {
            return Video.getVideoCount();
        },
        productionCount: async () => {
            return Production.getProductionCount();
        },
        categoryCount: async () => {
            return Category.getCategoryCount();
        }
    },
    User: {
        identity: async (obj) => {
            return obj.getIdentity();
        }
    },
    Person: {
        roles: async(obj) => {
            return Role.getRolesForPerson(obj);
        }
    },
    Role: {
        appearsAfter: async(obj) => {
            return obj.getPreviousRole();
        }
    },
    Production: {
        videos: async (obj) => {
            return obj.getProductionVideos();
        },
        images: async (obj) => {
            return obj.getProductionImages();
        },
        createdBy: async (obj) => {
            return obj.getCreator();
        },
        category: async (obj) => {
            return obj.getCategory();
        },
        thumbnail: async (obj) => {
            return obj.getThumbnail();
        },
        credits: async (obj) => {
            return Credit.getCreditsForProduction(obj);
        }
    },
    Credit: {
        person: async (obj) => {
            return obj.getPerson();
        },
        appearsAfter: async (obj) => {
            return obj.getPreviousCredit();
        }
    },
    Category: {
        parent: async (obj) => {
            return obj.getParentCategory();
        },
        appearsAfter: async (obj) => {
            return obj.getPreviousCategory();
        }
    },

    Mutation: {
        createPerson: async (obj, args) => {
            return Person.createPerson(args.firstName, args.lastName, args.preferredName, args.classYear);
        },
        updatePerson: async (obj, args) => {
            const person = await Person.getPersonFromId(args.id);
            if(person == null)
                throw new Error('Person with the provided \'id\' does not exist!');
            if(args.firstName !== undefined) {
                person.firstName = args.firstName;
            }
            if(args.lastName !== undefined) {
                person.lastName = args.lastName;
            }
            if(args.preferredName !== undefined) {
                person.preferredName = args.preferredName;
            }
            if(args.classYear !== undefined) {
                person.classYear = args.classYear;
            }
            if(await person.save())
                return person;
            return null;
        },
        deletePerson: async (obj, args) => {
            const person = await Person.getPersonFromId(args.id);
            if(person == null)
                throw new Error('Person with the provided \'id\' does not exist!');
            await person.delete();
            return true;
        },
        createRole: async (obj, args) => {
            return Role.createRole(await Person.getPersonFromId(args.owner), args.name, args.startDate,
                args.endDate, await Role.getRoleFromId(args.appearsAfter));
        },
        updateRole: async (obj, args) => {
            const role = await Role.getRoleFromId(args.id);
            if(role == null)
                throw new Error('Role with the provided \'id\' does not exist!');
            if(args.name !== undefined) {
                role.name = args.name;
            }
            if(args.owner !== undefined) {
                await role.setOwner(args.owner);
            }
            if(args.startDate !== undefined) {
                role.startDate = args.startDate;
            }
            if(args.endDate !== undefined) {
                role.endDate = args.endDate;
            }
            if(args.appearsAfter !== undefined) {
                await role.setPreviousRole(args.appearsAfter);
            }
            if(await role.save())
                return role;
            return null;
        },
        deleteRole: async (obj, args) => {
            const role = Role.getRoleFromId(args.id);
            if(role == null)
                throw new Error('Role with the provided \'id\' does not exist!');
            await role.delete();
            return true;
        }
    }
};

module.exports = resolvers;
