const { VideoTypes } = require('./classes/Video');
const { DateTimeResolver, JSONResolver } = require('graphql-scalars');

const resolvers = {
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    Query: {
        users: async (obj, args, ctx) => {
            return ctx.model.User.getPaginatedUsers(args.pageSize, args.prevUserIndex, args.searchCtx, !!args.advancedSearch);
        },
        members: async (obj, args, ctx) => {
            return ctx.model.Person.getPaginatedMembers(args.pageSize, args.prevPersonIndex);
        },
        people: async (obj, args, ctx) => {
            return ctx.model.Person.getPaginatedPeople(args.pageSize, args.prevPersonIndex, args.searchCtx, !!args.advancedSearch);
        },
        images: async (obj, args, ctx) => {
            return ctx.model.Image.getPaginatedImages(args.pageSize, args.prevImageIndex, args.searchCtx, !!args.advancedSearch);
        },
        videos: async (obj, args, ctx) => {
            const vids = await ctx.model.Video.getPaginatedVideos(args.pageSize, args.prevVideoIndex, args.searchCtx, !!args.advancedSearch);
            for(let i = 0; i < vids.length; i++) {
                if(vids[i] !== null)
                    vids[i].unpackForClient();
            }
            return vids;
        },
        productions: async (obj, args, ctx) => {
            return ctx.model.Production.getPaginatedProductions(args.pageSize, args.prevProductionIndex, args.searchCtx, !!args.advancedSearch);
        },
        categories: async (obj, args, ctx) => {
            return ctx.model.Category.getPaginatedCategories(args.pageSize, args.prevCategoryIndex, args.searchCtx, !!args.advancedSearch);
        },

        getUser: async (obj, args, ctx) => {
            return ctx.model.User.getUserFromId(args.id);
        },
        getPerson: async (obj, args, ctx) => {
            return ctx.model.Person.getPersonFromId(args.id);
        },
        getRole: async (obj, args, ctx) => {
            return ctx.model.Role.getRoleFromId(args.id);
        },
        getImage: async (obj, args, ctx) => {
            return ctx.model.Image.getImageFromId(args.id);
        },
        getVideo: async (obj, args, ctx) => {
            const vid = await ctx.model.Video.getVideoFromId(args.id);
            if(vid !== null)
                vid.unpackForClient();
            return vid;
        },
        getProduction: async (obj, args, ctx) => {
            return ctx.model.Production.getProductionFromId(args.id);
        },
        getCategory: async (obj, args, ctx) => {
            return ctx.model.Category.getCategoryFromId(args.id);
        },
        getCredit: async (obj, args, ctx) => {
            return ctx.model.Credit.getCreditFromId(args.id);
        },

        userCount: async (obj, args, ctx) => {
            return ctx.model.User.getUserCount(args.searchCtx, !!args.advancedSearch);
        },
        peopleCount: async (obj, args, ctx) => {
            return ctx.model.Person.getPeopleCount(args.searchCtx, !!args.advancedSearch);
        },
        memberCount: async (obj, args, ctx) => {
            return ctx.model.Person.getMemberCount();
        },
        imageCount: async (obj, args, ctx) => {
            return ctx.model.Image.getImageCount(args.searchCtx, !!args.advancedSearch);
        },
        videoCount: async (obj, args, ctx) => {
            return ctx.model.Video.getVideoCount(args.searchCtx, !!args.advancedSearch);
        },
        productionCount: async (obj, args, ctx) => {
            return ctx.model.Production.getProductionCount(args.searchCtx, !!args.advancedSearch);
        },
        categoryCount: async (obj, args, ctx) => {
            return ctx.model.Category.getCategoryCount(args.searchCtx, !!args.advancedSearch);
        }
    },
    User: {
        identity: async (obj) => {
            return obj.getIdentity();
        }
    },
    Person: {
        roles: async(obj, args, ctx) => {
            return ctx.model.Role.getRolesForPerson(obj);
        }
    },
    Role: {
        appearsAfter: async(obj) => {
            return obj.getPreviousRole();
        }
    },
    Production: {
        videos: async (obj) => {
            const vids = await obj.getProductionVideos();
            for(let i = 0; i < vids.length; i++) {
                if(vids[i] !== null)
                    vids[i].unpackForClient();
            }
            return vids;
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
        credits: async (obj, args, ctx) => {
            return ctx.model.Credit.getCreditsForProduction(obj.id);
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
    Video: {
        __resolveType(vid) {
            switch(vid.videoType) {
                case VideoTypes.EMBED:
                    return "EmbedVideo";
                case VideoTypes.RTMP:
                    return "RTMPVideo"
            }
        }
    },

    Mutation: {
        createPerson: async (obj, args, ctx) => {
            return ctx.model.Person.createPerson(args.firstName, args.lastName, args.preferredName, args.classYear);
        },
        updatePerson: async (obj, args, ctx) => {
            const person = await ctx.model.Person.getPersonFromId(args.id);
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
        deletePerson: async (obj, args, ctx) => {
            const person = await ctx.model.Person.getPersonFromId(args.id);
            if(person == null)
                throw new Error('Person with the provided \'id\' does not exist!');
            await person.delete();
            return true;
        },
        createRole: async (obj, args, ctx) => {
            return ctx.model.Role.createRole(await ctx.model.Person.getPersonFromId(args.owner), args.name, args.startDate,
                args.endDate, await ctx.model.Role.getRoleFromId(args.appearsAfter));
        },
        updateRole: async (obj, args, ctx) => {
            const role = await ctx.model.Role.getRoleFromId(args.id);
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
        deleteRole: async (obj, args, ctx) => {
            const role = await ctx.model.Role.getRoleFromId(args.id);
            if(role == null)
                throw new Error('Role with the provided \'id\' does not exist!');
            await role.delete();
            return true;
        },
        uploadImage: async (obj, args, ctx) => {
            return ctx.model.Image.uploadImage(args.name, await args.file);
        },
        createOffsiteImage: async (obj, args, ctx) => {
            return ctx.model.Image.createImage(args.name, args.link);
        },
        deleteImage: async (obj, args, ctx) => {
            const img = await ctx.model.Image.getImageFromId(args.id);
            if(img == null) {
                throw new Error('Image with the provided \'id\' does not exist!');
            }
            await img.delete();
            return true;
        },
        updateImage: async (obj, args, ctx) => {
            const img = await ctx.model.Image.getImageFromId(args.id);
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
        createEmbedVideo: async (obj, args, ctx) => {
            const vid = await ctx.model.Video.createEmbedVideo(args.name, args.url);
            if(vid !== null)
                vid.unpackForClient();
            return vid;
        },
        createRTMPVideo: async (obj, args, ctx) => {
            const vid = await ctx.model.Video.createRTMPVideo(args.name, args.rtmpUrl);
            if(vid !== null)
                vid.unpackForClient();
            return vid;
        },
        updateEmbedVideo: async (obj, args, ctx) => {
            const video = await ctx.model.Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            if(video.videoType !== VideoTypes.EMBED) {
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
            if(await video.save()) {
                video.unpackForClient();
                return video;
            }
            return null;

        },
        updateRTMPVideo: async (obj, args, ctx) => {
            const video = await ctx.model.Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            if(video.videoType !== VideoTypes.RTMP) {
                throw new Error('Video with the provided \'id\' is not an RTMP-type Video!');
            }
            if(args.name !== undefined) {
                video.name = args.name;
            }
            if(args.rtmpUrl !== undefined) {
                if(!args.rtmpUrl.startsWith("rtmp://")) {
                    throw new Error("Malformed rtmpUrl: Must begin with \"rtmp://\"!")
                }
                video.data.url = args.rtmpUrl;
            }
            if(await video.save()) {
                video.unpackForClient();
                return video;
            }
            return null;

        },
        deleteVideo: async (obj, args, ctx) => {
            const video = await ctx.model.Video.getVideoFromId(args.id);
            if(video == null) {
                throw new Error('Video with the provided \'id\' does not exist!');
            }
            await video.delete();
            return true;
        },
        createProduction: async (obj, args, ctx) => {
            return ctx.model.Production.createProduction(args.name, args.description,
                await ctx.model.Image.getImageFromId(args.thumbnail),
                await ctx.model.Category.getCategoryFromId(args.category),
                args.startTime, args.visible);
        },
        updateProduction: async (obj, args, ctx) => {
            const production = await ctx.model.Production.getProductionFromId(args.id);
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
                await production.setThumbnail(await ctx.model.Image.getImageFromId(args.thumbnail));
            }
            if(args.category !== undefined) {
                await production.setCategory(await ctx.model.Category.getCategoryFromId(args.category));
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
        deleteProduction: async (obj, args, ctx) => {
            const production = await ctx.model.Production.getProductionFromId(args.id);
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.delete();
            return true;

        },
        addVideoToProduction: async (obj, args, ctx) => {
            const video = await ctx.model.Video.getVideoFromId(args.video);
            const production = await ctx.model.Production.getProductionFromId(args.production);
            if(video == null)
                throw new Error('Video with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.addProductionVideo(video);
            return true;
        },
        removeVideoFromProduction: async (obj, args, ctx) => {
            const video = await ctx.model.Video.getVideoFromId(args.video);
            const production = await ctx.model.Production.getProductionFromId(args.production);
            if(video == null)
                throw new Error('Video with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.removeProductionVideo(video);
            return true;
        },
        addImageToProduction: async (obj, args, ctx) => {
            const image = await ctx.model.Image.getImageFromId(args.image);
            const production = await ctx.model.Production.getProductionFromId(args.production);
            if(image == null)
                throw new Error('Image with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.addProductionImage(image);
            return true;
        },
        removeImageFromProduction: async (obj, args, ctx) => {
            const image = await ctx.model.Image.getImageFromId(args.image);
            const production = await ctx.model.Production.getProductionFromId(args.production);
            if(image == null)
                throw new Error('Image with the provided \'id\' does not exist!');
            if(production == null)
                throw new Error('Production with the provided \'id\' does not exist!');
            await production.removeProductionImage(image);
            return true;
        },
        addCredit: async (obj, args, ctx) => {
            return ctx.model.Credit.createCredit(args.production, args.person, args.job, args.appearsAfter)
        },
        updateCredit: async (obj, args, ctx) => {
            const credit = await ctx.model.Credit.getCreditFromId(args.id);
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
        deleteCredit: async (obj, args, ctx) => {
            const credit = await ctx.model.Credit.getCreditFromId(args.id);
            if(credit == null)
                throw new Error('Credit with the provided \'id\' does not exist!');
            await credit.delete();
            return true;
        },
        createCategory: async (obj, args, ctx) => {
            return ctx.model.Category.createCategory(args.name, args.parent, args.appearsAfter);
        },
        updateCategory: async (obj, args, ctx) => {
            const category = await ctx.model.Category.getCategoryFromId(args.id);
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
        deleteCategory: async (obj, args, ctx) => {
            const category = await ctx.model.Category.getCategoryFromId(args.id);
            if(category == null)
                throw new Error('Category with the provided \'id\' does not exist!');
            await category.delete();
            return true;
        }
    }
};

module.exports = resolvers;
