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
            const role = await Role.getRoleFromId(args.id);
            if(role == null)
                throw new Error('Role with the provided \'id\' does not exist!');
            await role.delete();
            return true;
        },
        uploadImage: async (obj, args) => {
            return Image.uploadImage(args.name, await args.file);
        },
        createOffsiteImage: async (obj, args) => {
            return Image.createImage(args.name, args.link);
        },
        deleteImage: async (obj, args) => {
            const img = await Image.getImageFromId(args.id);
            if(img == null) {
                throw new Error('Image with the provided \'id\' does not exist!');
            }
            await img.delete();
            return true;
        },
        updateImage: async (obj, args) => {
            const img = await Image.getImageFromId(args.id);
            if(img == null) {
                throw new Error('Image with the provided \'id\' does not exist!');
            }
            if(args.name !== undefined) {
                img.name = args.name;
            }
            if(await img.save()) {
                return img;
            }
            return null;
        },
        createEmbedVideo: async (obj, args) => {
            return Video.createEmbedVideo(args.name, args.url);
        },
        createRTMPVideo: async (obj, args) => {
            return Video.createRTMPVideo(args.name, args.rtmpUrl);
        },
        updateEmbedVideo: async (obj, args) => {
            const video = await Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            if(video.videoType !== "EMBED") {
                throw new Error('Video with the provided \'id\' is not an embed-type Video!');
            }
            if(args.name !== undefined) {
                video.name = args.name;
            }
            if(args.url !== undefined) {
                if(!args.url.match(/^https?:\/\//)) {
                    throw new Error("Malformed url: Beginning must match \"https?:\\/\\/\"!")
                }
                video.data.url = args.url;
            }
            if(await video.save())
                return video;
            return null;

        },
        updateRTMPVideo: async (obj, args) => {
            const video = await Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            if(video.videoType !== "RTMP") {
                throw new Error('Video with the provided \'id\' is not an RTMP-type Video!');
            }
            if(args.name !== undefined) {
                video.name = args.name;
            }
            if(args.rtmpUrl !== undefined) {
                if(!args.rtmpUrl.startsWith("rtmp://")) {
                    throw new Error("Malformed rtmpUrl: Must begin with \"rtmp://\"!")
                }
                video.data.rtmpUrl = args.rtmpUrl;
            }
            if(await video.save())
                return video;
            return null;

        },
        deleteVideo: async (obj, args) => {
            const video = await Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            await video.delete();
            return true;
        },
        createProduction: async (obj, args) => {
            return Production.createProduction(args.name, args.description,
                await Image.getImageFromId(args.thumbnail), await Category.getCategoryFromId(args.category),
                args.startTime, args.visible);
        },
        updateProduction: async (obj, args) => {
            const production = await Production.getProductionFromId(args.id);
            if(production == null) {
                throw new Error('Production with the provided \'id\' does not exist!');
            }
            if(args.name !== undefined) {
                production.name = args.name;
            }
            if(args.description !== undefined) {
                production.description = args.description;
            }
            if(args.thumbnail !== undefined) {
                await production.setThumbnail(await Image.getImageFromId(args.thumbnail));
            }
            if(args.category !== undefined) {
                await production.setCategory(await Category.getCategoryFromId(args.category));
            }
            if(args.startTime !== undefined) {
                production.startTime = args.startTime;
            }
            if(args.visible !== undefined) {
                production.visible = args.visible;
            }
            if(await production.save())
                return production;
            return null;
        },
        deleteProduction: async (obj, args) => {
            const production = await Production.getProductionFromId(args.id);
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.delete();
            return true;

        },
        addVideoToProduction: async (obj, args) => {
            const video = await Video.getVideoFromId(args.video);
            const production = await Production.getProductionFromId(args.production);
            if(video == null)
                throw new Error('Video with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.addProductionVideo(video);
            return true;
        },
        removeVideoFromProduction: async (obj, args) => {
            const video = await Video.getVideoFromId(args.video);
            const production = await Production.getProductionFromId(args.production);
            if(video == null)
                throw new Error('Video with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.removeProductionVideo(video);
            return true;
        },
        addImageToProduction: async (obj, args) => {
            const image = await Image.getImageFromId(args.image);
            const production = await Production.getProductionFromId(args.production);
            if(image == null)
                throw new Error('Image with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.addProductionImage(image);
            return true;
        },
        removeImageFromProduction: async (obj, args) => {
            const image = await Image.getImageFromId(args.image);
            const production = await Production.getProductionFromId(args.production);
            if(image == null)
                throw new Error('Image with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.removeProductionImage(image);
            return true;
        },
        addCredit: async (obj, args) => {
            return Credit.createCredit(args.production, args.person, args.job, args.appearsAfter)
        },
        updateCredit: async (obj, args) => {
            const credit = await Credit.getCreditFromId(args.id);
            if(credit == null)
                throw new Error('Credit with the provided \'id\' does not exist!');
            if(args.person !== undefined) {
                await credit.setPerson(args.person);
            }
            if(args.appearsAfter !== undefined) {
                await credit.setPreviousCredit(args.appearsAfter);
            }
            if(args.job !== undefined) {
                credit.job = args.job;
            }
            if(await credit.save())
                return credit;
            return null;
        },
        deleteCredit: async (obj, args) => {
            const credit = await Credit.getCreditFromId(args.id);
            if(credit == null)
                throw new Error('Credit with the provided \'id\' does not exist!');
            await credit.delete();
            return true;
        },
        createCategory: async (obj, args) => {
            return Category.createCategory(args.name, args.parent, args.appearsAfter);
        },
        updateCategory: async (obj, args) => {
            const category = await Category.getCategoryFromId(args.id);
            if(category == null)
                throw new Error('Category with the provided \'id\' does not exist!');
            if(args.name !== undefined) {
                category.name = args.name;
            }
            if(args.parent !== undefined) {
                await category.setParentCategory(args.parent);
            }
            if(args.appearsAfter !== undefined) {
                await category.setPreviousCategory(args.appearsAfter);
            }
            if(await category.save())
                return category;
            return null;
        },
        deleteCategory: async (obj, args) => {
            const category = await Category.getCategoryFromId(args.id);
            if(category == null)
                throw new Error('Category with the provided \'id\' does not exist!');
            await category.delete();
            return true;
        }
    }
};

module.exports = resolvers;
