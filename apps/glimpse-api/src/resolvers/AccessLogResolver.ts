import {Arg, Query, Resolver} from "type-graphql";
import {AccessLog} from "../models/AccessLog";
import {prisma} from "../prisma";

@Resolver(AccessLog)
class AccessLogResolver {
    @Query(() => [AccessLog])
    async accessLogs(@Arg("interval", {nullable: true}) interval?: number) {
        let filter;
        if (interval && interval > 0) {
            filter = {
                where: {
                    timestamp: {
                        gt: new Date(Date.now() - interval * 86400000),
                    },
                },
            };
        }
        return prisma.accessLog.findMany(filter);
    }

    @Query(() => AccessLog, { nullable: true })
    async accessLog(@Arg("id") id: number) {
        return prisma.accessLog.findUnique({
            where: {
                id
            }
        })
    }

    @Query(() => [AccessLog])
    async accessLogsFromIp(@Arg("ip") ip: string) {
        return prisma.accessLog.findMany({
            where: {
                ip
            }
        })
    }

    @Query(() => [AccessLog])
    async accessLogsFromUser(@Arg("userId") userId: number) {
        return prisma.accessLog.findMany({
            where: {
                userId: userId
            }
        })
    }
}

export {AccessLogResolver};
