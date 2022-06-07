import {
    FindUniqueUserResolver,
    FindFirstUserResolver,
    FindManyUserResolver,
    AggregateUserResolver,
    GroupByUserResolver,
    CreateUserResolver,
    DeleteUserResolver,
    UpdateUserResolver,
    UserRelationsResolver,
    applyResolversEnhanceMap,
    applyModelsEnhanceMap,
    applyRelationResolversEnhanceMap,
    applyOutputTypesEnhanceMap,
    applyArgsTypesEnhanceMap,
    applyInputTypesEnhanceMap
} from "@generated/type-graphql";
import {NonEmptyArray, Authorized} from "type-graphql";

export function getResolvers(): NonEmptyArray<Function> {
    applyResolversEnhanceMap({
        User: {
            user: [Authorized("glimpse:resolver:user", "read")],
            findFirstUser: [Authorized("glimpse:resolver:user", "read")],
            users: [Authorized("glimpse:resolver:user", "read")],
            aggregateUser: [Authorized("glimpse:resolver:user", "read")],
            groupByUser: [Authorized("glimpse:resolver:user", "read")],
            createUser: [Authorized("glimpse:resolver:user", "create")],
            deleteUser: [Authorized("glimpse:resolver:user", "delete")],
            updateUser: [Authorized("glimpse:resolver:user", "update")],
        }
    });

    applyModelsEnhanceMap({
        User: {
            fields: {
                id: [Authorized("glimpse:field:user:id", "read")],
                username: [Authorized("glimpse:field:user:username", "read")],
                mail: [Authorized("glimpse:field:user:mail", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
                discord: [Authorized("glimpse:field:user:discord", "read")],
                joined: [Authorized("glimpse:field:user:joined", "read")]
            }
        }
    });

    applyRelationResolversEnhanceMap({
        User: {
            person: [Authorized("glimpse:field:user:person", "read")],
            accessLogs: [Authorized("glimpse:field:user:accessLogs", "read")],
            auditLogs: [Authorized("glimpse:field:user:auditLogs", "read")],
            assignedContactSubmissions: [Authorized("glimpse:field:user:assignedContactSubmissions", "read")],
            productionRsvps: [Authorized("glimpse:field:user:productionRsvps", "read")],
            permissions: [Authorized("glimpse:field:user:permissions", "read")],
            voteResponses: [Authorized("glimpse:field:user:voteResponses", "read")]
        }
    })

    applyOutputTypesEnhanceMap({
        UserAvgAggregate: {
            fields: {
                discord: [Authorized("glimpse:field:user:discord", "read")],
                id: [Authorized("glimpse:field:user:id", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
            }
        },
        UserCount: {
            fields: {
                accessLogs: [Authorized("glimpse:field:user:accessLogs", "read")],
                assignedContactSubmissions: [Authorized("glimpse:field:user:assignedContactSubmissions", "read")],
                auditLogs: [Authorized("glimpse:field:user:auditLogs", "read")],
                permissions: [Authorized("glimpse:field:user:permissions", "read")],
                productionRsvps: [Authorized("glimpse:field:user:productionRsvps", "read")],
                voteResponses: [Authorized("glimpse:field:user:voteResponses", "read")],
            }
        },
        UserCountAggregate: {
            fields: {
                _all: [Authorized("glimpse:field:user:*", "read")],
                id: [Authorized("glimpse:field:user:id", "read")],
                username: [Authorized("glimpse:field:user:username", "read")],
                mail: [Authorized("glimpse:field:user:mail", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
                discord: [Authorized("glimpse:field:user:discord", "read")],
                joined: [Authorized("glimpse:field:user:joined", "read")]
            }
        },
        UserGroupBy: {
            fields: {
                id: [Authorized("glimpse:field:user:id", "read")],
                username: [Authorized("glimpse:field:user:username", "read")],
                mail: [Authorized("glimpse:field:user:mail", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
                discord: [Authorized("glimpse:field:user:discord", "read")],
                joined: [Authorized("glimpse:field:user:joined", "read")]
            }
        },
        UserMaxAggregate: {
            fields: {
                id: [Authorized("glimpse:field:user:id", "read")],
                username: [Authorized("glimpse:field:user:username", "read")],
                mail: [Authorized("glimpse:field:user:mail", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
                discord: [Authorized("glimpse:field:user:discord", "read")],
                joined: [Authorized("glimpse:field:user:joined", "read")]
            }
        },
        UserMinAggregate: {
            fields: {
                id: [Authorized("glimpse:field:user:id", "read")],
                username: [Authorized("glimpse:field:user:username", "read")],
                mail: [Authorized("glimpse:field:user:mail", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")],
                discord: [Authorized("glimpse:field:user:discord", "read")],
                joined: [Authorized("glimpse:field:user:joined", "read")]
            }
        },
        UserSumAggregate: {
            fields: {
                discord: [Authorized("glimpse:field:user:discord", "read")],
                id: [Authorized("glimpse:field:user:id", "read")],
                personId: [Authorized("glimpse:field:user:person", "read")]
            }
        }
    })

    applyArgsTypesEnhanceMap({

    })

    applyInputTypesEnhanceMap({
        AccessLogCreateNestedManyWithoutUserInput: {

        }
    })

    return [
        FindUniqueUserResolver,
        FindFirstUserResolver,
        FindManyUserResolver,
        AggregateUserResolver,
        GroupByUserResolver,
        CreateUserResolver,
        DeleteUserResolver,
        UpdateUserResolver,
        UserRelationsResolver
    ]
}

