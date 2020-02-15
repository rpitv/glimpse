const {gql} = require('apollo-server');

const typeDefs = gql`
    scalar DateTime
    
    type Query {
        users(pageSize: Int, prevUserIndex: Int): [User!]!
        members(pageSize: Int, prevPersonIndex: Int): [Person!]!
        people(pageSize: Int, prevPersonIndex: Int): [Person!]!
        images(pageSize: Int, prevImageIndex: Int): [Image!]!

        userCount: Int!
        memberCount: Int!
        peopleCount: Int!
        imageCount: Int!
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
        Returns true on success, false otherwise
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
    }
    
    type Image {
        id: ID!
        name: String!
        link: String!
        added: DateTime!
    }

    type Production {
        id: ID!
        name: String!
        createdBy: User
        description: String
        embedLink: String
        videos: [Video!]
        category: Category
        credits: [Credit]
        startsAt: DateTime!
        createdAt: DateTime!
        visible: Boolean! # Whether this production is visible to non-admins
    }

    type Credit {
        person: Person!
        job: String
        priority: Int
    }

    type Video {
        id: ID!
        link: String!
    }

    type Category {
        name: String!
        priority: Int
        parent: Category
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
