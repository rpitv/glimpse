const {gql} = require('apollo-server');

const typeDefs = gql`
    scalar DateTime
    
    type Query {
        users: [User!]!
        members: [Person!]!
        people: [Person!]!
    }
    
#    type Mutation {
#
#    }

    type Image {
        id: ID!
        name: String!
        link: String!
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

    # A User is someone who can log into the website. Users do not have to have a name or have to be a member of the club,
    # however they can be by having an associated identity.
    type User {
        id: ID!
        email: String
        joined: DateTime
        identity: Person
        isAdmin: Boolean
    }

    # A Person is NOT a user, but just a record of the identity of someone who may or may not be in the club.
    # If a Person is a member of the club, they should have at least one Role in the roles array.
    type Person {
        id: ID!
        firstName: String!
        preferredName: String
        lastName: String # Last names should not be required just in case
        classYear: Int # Graduating year
        roles: [Role!] # If null, assume this person has never been a member
    }

    # Roles are assigned to People to show their membership status. Not all people are required to have a role,
    # or they can have an unlimited number of roles. However, they should probably only have one at any given moment.
    type Role {
        name: String!
        startDate: DateTime
        endDate: DateTime
        priority: Int # Assuming this role is currently active, used to determine where the assigned
        # user should appear in relation to others with different roles.
    }
`;

module.exports = typeDefs;
