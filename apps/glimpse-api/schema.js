const {gql} = require('apollo-server');

// Bodge fix for GraphQL JS Webstorm Plugin type checking - Upload is inserted by Apollo
gql`
scalar Upload
`;

const typeDefs = gql`
    scalar DateTime
    scalar JSON
    
    type Query {
        """
        Get a list of all User objects in a paginated or non-paginated manner.
        """
        users(pageSize: Int, prevUserIndex: Int): [User!]!
        """
        Get a list of all Person objects which have an active role in a paginated or non-paginated manner.
        """
        members(pageSize: Int, prevPersonIndex: Int): [Person!]!
        """
        Get a list of all Person objects regardless of member status in a paginated or non-paginated manner.
        """
        people(pageSize: Int, prevPersonIndex: Int): [Person!]!
        """
        Get a list of all Image objects in the database in a paginated or non-paginated manner.
        """
        images(pageSize: Int, prevImageIndex: Int): [Image!]!
        """
        Get a list of all Video objects in the database in a paginated or non-paginated manner.
        """
        videos(pageSize: Int, prevVideoIndex: Int): [Video!]!
        """
        Get a list of all Production objects in a paginated or non-paginated manner.
        """
        productions(pageSize: Int, prevProductionIndex: Int): [Production!]!
        """
        Get a list of all Category objects in a paginated or non-paginated manner.
        """
        categories(pageSize: Int, prevCategoryIndex: Int): [Category!]!
        
        """
        Get some User object based on that object's ID. Returns null if the User does not exist in the database.
        """
        getUser(id: Int!): User
        """
        Get some Person object based on that object's ID. Returns null if the Person does not exist in the database.
        """
        getPerson(id: Int!): Person
        """
        Get some Role object based on that object's ID. Returns null if the Role does not exist in the database.
        """
        getRole(id: Int!): Role
        """
        Get some Image object based on that object's ID. Returns null if the Image does not exist in the database.
        """
        getImage(id: Int!): Image
        """
        Get some Video object based on that object's ID. Returns null if the Video does not exist in the database.
        """
        getVideo(id: Int!): Video
        """
        Get some Production object based on that object's ID. Returns null if the Production does not exist in 
        the database.
        """
        getProduction(id: Int!): Production
        """
        Get some Credit object based on that object's ID. Returns null if the Credit does not exist in the database.
        """
        getCredit(id: Int!): Credit
        """
        Get some Category object based on that object's ID. Returns null if the Category does not exist in the database.
        """
        getCategory(id: Int!): Category
        
        """
        The total number of Users in the database.
        """
        userCount: Int!
        """
        The total number of Persons in the database which have an active Role at the given moment.
        """
        memberCount: Int!
        """
        The total number of Persons in the database.
        """
        peopleCount: Int!
        """
        The total number of Images in the database.
        """
        imageCount: Int!
        """
        The total number of Videos in the database.
        """
        videoCount: Int!
        """
        The total number of Productions in the database.
        """
        productionCount: Int!
        """
        The total number of Categories in the database.
        """
        categoryCount: Int!
    }
    
    type Mutation {
        """
        Create a new person in the database. Returns the newly created Person.
        """
        createPerson(firstName: String, lastName: String, preferredName: String, classYear: Int): Person
        """
        Update a person in the database with new information. Returns the updated person.
        """
        updatePerson(id: Int!, firstName: String, lastName: String, preferredName: String, classYear: Int): Person
        """
        Delete a person from the database. Will also delete all of their roles.
        Returns true on success, false otherwise.
        """
        deletePerson(id: Int!): Boolean
        """
        Add a role to a person in the database. Returns the newly created Role.
        """
        createRole(owner: Int!, name: String! startDate: DateTime, endDate: DateTime, appearsAfter: Int): Role
        """
        Update an existing Role in the database with new information. Returns the new Role.
        """
        updateRole(id: Int!, owner: Int, name: String, startDate: DateTime, endDate: DateTime, appearsAfter: Int): Role
        """
        Delete a role from the database.
        Returns true on success, false otherwise.
        """
        deleteRole(id: Int!): Boolean
        """
        Upload an image to the database.
        """
        uploadImage(file: Upload!): Image
        """
        Create a new image which is hosted at an off-site URL.
        """
        createOffsiteImage(name: String!, link: String!): Image
        """
        Delete an image from the database. Also deletes any image-links to productions using this Image.
        Returns true on success, false otherwise.
        """
        deleteImage(id: Int!): Boolean
        """
        Update an image in the database.
        """
        updateImage(id: Int!, name: String): Image
        
        """
        Create a new video in the database. Takes a loosely-defined JSON data value which contains the video's metadata.
        TODO should be improved to have different methods for different types of videos.
        """
        createVideo(name: String!, videoType: Int!, data: JSON!): Video # TODO Improve syntax
        """
        Update a video in the database.
        """
        updateVideo(id: Int!, name: String, videoType: Int, data: JSON): Video
        """
        Delete a video from the database. Also deletes any video-links to productions using this Video.
        Returns true on success, false otherwise.
        """
        deleteVideo(id: Int!): Boolean
        
        """
        Create a new Production in the database.
        """
        createProduction(name: String!, description: String, thumbnail: Int, category: Int,
            startTime: DateTime, visible: Boolean): Production
        """
        Update a production in the database.
        """
        updateProduction(id: Int!, name: String, description: String, thumbnail: Int, category: Int,
            startTime: DateTime, visible: Boolean): Production
        """
        Delete a production from the database. Also deletes any Credits, video-links, and image-links from the database.
        Returns true on success, false otherwise.
        """
        deleteProduction(id: Int!): Boolean
        """
        Link a Video to a Production.
        """
        addVideoToProduction(production: Int!, video: Int!): Boolean
        """
        Unlink a Video from a Production.
        """
        removeVideoFromProduction(production: Int!, video: Int!): Boolean
        """
        Link an Image to a Production.
        """
        addImageToProduction(production: Int!, image: Int!): Boolean
        """
        Unlink an Image from a Production.
        """
        removeImageFromProduction(production: Int!, image: Int!): Boolean
        """
        Create a Credit in a Production for a Person.
        """
        addCredit(production: Int!, person: Int!, job: String, appearsAfter: Int): Credit
        """
        Update a Credit.
        """
        updateCredit(id: Int!, person: Int, job: String, appearsAfter: Int): Credit
        """
        Delete a Credit from a Production. Will update any Credits which appear after this Credit to appear after the
        Credit that this Credit appears after.
        Returns true on success, false otherwise.
        """
        deleteCredit(id: Int!): Boolean
        
        """
        Create a new Category.
        """
        createCategory(name: String!, parent: Int, appearsAfter: Int): Category
        """
        Update a Category.
        """
        updateCategory(id: Int!, name: String, parent: Int, appearsAfter: Int): Category
        """
        Delete a Category. Will update any child Categories to have the parent of this Category's parent. Will
        also update any Categories that appear after this Category to appear after the Category that this Category
        appears after.
        Returns true on success, false otherwise.
        """
        deleteCategory(id: Int!): Boolean
        
    }
    
    """
    Images are a type of media content which contain the metadata for a given image file on the site
    """
    type Image {
        id: ID!
        name: String!
        link: String!
        added: DateTime!
    }

    """
    Productions are the main wrapper for "content" on the website. A Production is some event which RPI TV attended
    or documented in some way. Productions can have Images or Videos associated with them, which are the literal
    content of a Production.
    """
    type Production {
        id: ID!
        name: String!
        createdBy: User
        description: String
        videos: [Video!]
        images: [Image!]
        thumbnail: Image
        category: Category
        credits: [Credit]
        startTime: DateTime!
        createTime: DateTime!
        visible: Boolean! # Whether this production is visible to non-admins
    }

    """
    Credits are a way of attributing acknowledgement of a given Person's contributions to a Production. Productions and
    People can have an unlimited number of Credits. Credits have an order property "appearsAfter" which is directed
    by the backend, allowing for complex ordering of which Credits should appear first.
    """
    type Credit {
        person: Person!
        job: String
        appearsAfter: Credit
    }

    """
    Videos are a type of media content which contain the metadata for a given video file on the site.
    Different types of videos can have different attributes, so a loosely-defined schema exists in this type's
    "data" field.
    """
    type Video {
        id: ID!
        name: String!
        videoType: Int!
        data: JSON!
    }

    """
    A Category is a type of separative attribute that can be applied to different items in the database, 
    namely Productions. Categories can be ordered one after another and in a tree-like structure with parent
    and child Categories.
    """
    type Category {
        id: Int!
        name: String!
        parent: Category
        appearsAfter: Category
    }

    """
    A User is someone who can log into the website. Users do not have to have a name or have to be a member of the club,
    however they can be by having an associated identity.
    """
    type User {
        id: ID!
        email: String
        joined: DateTime
        identity: Person
        permissionLevel: Int
    }

    """
    A Person is NOT a user, but just a record of the identity of someone who may or may not be in the club.
    If a Person is a member of the club, they should have at least one Role in the roles array.
    """
    type Person {
        id: ID!
        firstName: String
        preferredName: String
        lastName: String
        classYear: Int # Graduating year
        roles: [Role!] # If null, assume this person has never been a member
    }

    """
    Roles are assigned to People to show their membership status. Not all people are required to have a role,
    or they can have an unlimited number of roles. However, they should probably only have one at any given moment.
    Roles can be ordered one after another directed by the backend.
    """
    type Role {
        id: Int!
        name: String!
        startDate: DateTime
        endDate: DateTime
        appearsAfter: Role # This is the role that this role should appear after when displayed in a list.
    }
`;

module.exports = typeDefs;
