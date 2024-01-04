import type { GroupPermission } from "@prisma/client";

export type GroupPermissionInput = Partial<GroupPermission> & { action: string };

export const guestPermissions: GroupPermissionInput[] = [
    {
        action: "create",
        subject: ["ContactSubmission"],
        conditions: {
            resolved: false
        }
    },
    {
        action: "filter",
        subject: ["ProductionImage"],
        fields: ["productionId", "imageId"]
    },
    {
        action: "filter",
        subject: ["PersonRole"],
        fields: ["personId", "roleId"]
    },
    {
        action: "filter",
        subject: ["Production"],
        fields: ["name", "description", "startTime", "endTime", "category"]
    },
    {
        action: "filter",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "filter",
        subject: ["Role"],
        fields: ["name", "displayInMembership", "displayInLeadership"]
    },
    {
        action: "filter",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["Category"],
        fields: ["name", "priority", "parentId"]
    },
    {
        action: "filter",
        subject: ["Credit"],
        fields: ["personId", "productionId"]
    },
    {
        action: "filter",
        subject: ["ProductionVideo"],
        fields: ["productionId", "videoId"]
    },
    {
        action: "filter",
        subject: ["PersonImage"],
        fields: ["personId", "imageId"]
    },
    {
        action: "filter",
        subject: ["BlogPost"],
        fields: ["authorId", "authorDisplayName", "title", "content"]
    },
    {
        action: "filter",
        subject: ["ProductionTag"],
        fields: ["productionId", "tag"]
    },
    {
        action: "read",
        subject: ["GroupPermission"],
        conditions: {
            groupId: {
                in: "$groups"
            }
        }
    },
    {
        action: "read",
        subject: ["BlogPost"],
        conditions: {
            postedAt: {
                lte: "$now"
            }
        }
    },
    {
        action: "read",
        subject: [
            "Category",
            "Credit",
            "Image",
            "Person",
            "PersonImage",
            "PersonRole",
            "ProductionImage",
            "ProductionTag",
            "ProductionVideo",
            "Role",
            "Video"
        ]
    },
    {
        action: "read",
        subject: ["Redirect"],
        fields: ["key", "location", "id"],
        conditions: {
            OR: [
                {
                    expires: {
                        gt: "$now"
                    }
                },
                {
                    expires: null
                }
            ]
        }
    },
    {
        action: "read",
        subject: ["Production"],
        fields: ["id", "name", "description", "startTime", "endTime", "category", "eventLocation", "thumbnail", "videos", "images", "credits"]
    },
    {
        action: "sort",
        subject: ["BlogPost"],
        fields: ["postedAt", "title"]
    },
    {
        action: "sort",
        subject: ["Role"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["Production"],
        fields: ["name", "startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["Category"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["PersonRole"],
        fields: ["startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["ProductionVideo"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["ProductionTag"],
        fields: ["tag"]
    },
    {
        action: "sort",
        subject: ["ProductionImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["PersonImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "sort",
        subject: ["Image"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Credit"],
        fields: ["priority", "title"]
    },
    {
        action: "sort",
        subject: ["Video"],
        fields: ["name"]
    }
];

export const memberPermissions: GroupPermissionInput[] = [
    {
        action: "create",
        subject: ["ProductionRSVP"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "create",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "delete",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "filter",
        subject: ["Production"],
        fields: ["name", "description", "startTime", "endTime", "category", "closetLocation", "closetTime", "teamNotes"]
    },
    {
        action: "filter",
        subject: ["Role"],
        fields: ["name", "displayInMembership", "displayInLeadership"]
    },
    {
        action: "filter",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "filter",
        subject: ["ProductionRSVP"],
        fields: ["productionId"]
    },
    {
        action: "filter",
        subject: ["VoteResponse"],
        fields: ["voteId"]
    },
    {
        action: "filter",
        subject: ["AccessLog"],
        fields: ["ip", "timestamp", "service"]
    },
    {
        action: "filter",
        subject: ["BlogPost"],
        fields: ["authorId", "authorDisplayName", "title", "content"]
    },
    {
        action: "filter",
        subject: ["Credit"],
        fields: ["personId", "productionId"]
    },
    {
        action: "filter",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "filter",
        subject: ["PersonImage"],
        fields: ["personId", "imageId"]
    },
    {
        action: "filter",
        subject: ["PersonRole"],
        fields: ["personId", "roleId"]
    },
    {
        action: "filter",
        subject: ["ProductionImage"],
        fields: ["productionId", "imageId"]
    },
    {
        action: "filter",
        subject: ["Category"],
        fields: ["name", "priority", "parentId"]
    },
    {
        action: "filter",
        subject: ["ProductionTag"],
        fields: ["productionId", "tag"]
    },
    {
        action: "filter",
        subject: ["ProductionVideo"],
        fields: ["productionId", "videoId"]
    },
    {
        action: "read",
        subject: ["Vote"],
        fields: ["question", "options", "description", "expires"]
    },
    {
        action: "read",
        subject: ["GroupPermission"],
        conditions: {
            groupId: {
                in: "$groups"
            }
        }
    },
    {
        action: "read",
        subject: ["BlogPost"],
        conditions: {
            postedAt: {
                lte: "$now"
            }
        }
    },
    {
        action: "read",
        subject: [
            "Category",
            "Credit",
            "Image",
            "Person",
            "PersonImage",
            "PersonRole",
            "ProductionImage",
            "ProductionRSVP",
            "ProductionTag",
            "ProductionVideo",
            "Role",
            "Video",
            "Production"
        ]
    },
    {
        action: "read",
        subject: ["Redirect"],
        fields: ["key", "location", "id"],
        conditions: {
            OR: [
                {
                    expires: {
                        gt: "$now"
                    }
                },
                {
                    expires: null
                }
            ]
        }
    },
    {
        action: "read",
        subject: ["UserPermission", "AccessLog", "VoteResponse", "UserGroup", "User"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "sort",
        subject: ["AccessLog"],
        fields: ["ip", "timestamp", "service"]
    },
    {
        action: "sort",
        subject: ["Category"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["Credit"],
        fields: ["priority", "title"]
    },
    {
        action: "sort",
        subject: ["Image"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["Person"],
        fields: ["name", "graduation"]
    },
    {
        action: "sort",
        subject: ["PersonImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["PersonRole"],
        fields: ["startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["ProductionImage"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["ProductionTag"],
        fields: ["tag"]
    },
    {
        action: "sort",
        subject: ["ProductionVideo"],
        fields: ["priority"]
    },
    {
        action: "sort",
        subject: ["Production"],
        fields: ["name", "startTime", "endTime"]
    },
    {
        action: "sort",
        subject: ["Role"],
        fields: ["name", "priority"]
    },
    {
        action: "sort",
        subject: ["Video"],
        fields: ["name"]
    },
    {
        action: "sort",
        subject: ["VoteResponse"],
        fields: ["selection", "timestamp"]
    },
    {
        action: "sort",
        subject: ["BlogPost"],
        fields: ["postedAt", "title"]
    },
    {
        action: "update",
        subject: ["VoteResponse"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "update",
        subject: ["User"],
        fields: ["mail", "password"],
        conditions: {
            userId: "$id"
        }
    },
    {
        action: "update",
        subject: ["ProductionRSVP"],
        conditions: {
            userId: "$id"
        }
    }
];

export const adminPermissions: GroupPermissionInput[] = [
    {
        action: "manage",
        subject: ["all"]
    }
];
