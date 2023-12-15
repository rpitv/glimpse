import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { PrismaTransaction } from "../../../@types/express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { subject } from "@casl/ability";
import { Request } from "express";
import PaginationInput from "../../gql/pagination.input";
import { FilterUserInput } from "./dto/filter-user.input";
import { OrderUserInput } from "./dto/order-user.input";
import { CreateUserInput } from "./dto/create-user.input";
import { AuthService } from "../../auth/auth.service";
import { UpdateUserInput } from "./dto/update-user.input";
import { parseDateTimeInputs } from "../../util";

@Injectable()
export class UserService {
    private logger: Logger = new Logger("UserService");

    constructor(private authService: AuthService) {}

    public async findManyUser(
        prisma: PrismaTransaction,
        options?: {
            pagination?: PaginationInput;
            filter?: FilterUserInput;
            order?: OrderUserInput[];
        },
        ctx?: { req: Request }
    ): Promise<User[]> {
        this.logger.debug(`Received request to find Users. Options: ${JSON.stringify(options)}`);
        // The "WHERE" filter is a combination of the provided filter and the user's permissions, depending on what is
        //  provided.
        const filters: Prisma.UserWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).User);
        }

        parseDateTimeInputs(options?.filter?.joined, ["equals", "gt", "gte", "lt", "lte", "not"]);

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = options?.order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        this.logger.verbose("Calling prisma.user.findMany.");
        return prisma.user.findMany({
            where: { AND: filters },
            orderBy,
            skip: options?.pagination?.skip,
            take: Math.max(0, options?.pagination?.take ?? 20),
            cursor: options?.pagination?.cursor ? { id: BigInt(options?.pagination.cursor) } : undefined
        });
    }

    public async findOneUser(id: bigint, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<User> {
        this.logger.debug("Received request to find User with ID " + id + ".");

        const filters: Prisma.UserWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).User);
        }

        this.logger.verbose("Calling prisma.user.findFirst.");
        return prisma.user.findFirst({
            where: {
                AND: filters
            }
        });
    }

    public async createUser(data: CreateUserInput, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<User> {
        // Copy of User object without the password field, for logging purposes.
        const printableCopy = { ...data };
        if (printableCopy.password) {
            printableCopy.password = "********";
        }
        this.logger.debug("Received request to create a User. Data: " + JSON.stringify(data));

        data = plainToClass(CreateUserInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        if (data.password) {
            this.logger.verbose("Hashing password");
            data.password = await this.authService.hashPassword(data.password);
        }

        this.logger.verbose("Calling prisma.user.create.");
        const result = await prisma.user.create({ data });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            newValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    public async updateUser(
        id: bigint,
        data: UpdateUserInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<User> {
        // Copy of User object without the password field, for logging purposes.
        const printableCopy = { ...data };
        if (printableCopy.password) {
            printableCopy.password = "********";
        }
        this.logger.debug("Received request to update a User. Data: " + JSON.stringify(data));

        data = plainToClass(UpdateUserInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const filters: Prisma.UserWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).User);
        }
        this.logger.verbose("Calling prisma.user.findFirst.");
        const rowToUpdate = await prisma.user.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToUpdate) {
            this.logger.verbose("User not found. Throwing BadRequestException.");
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        if (ctx?.req?.permissions) {
            this.logger.verbose("Checking update permissions for each included field.");
            for (const field of Object.keys(data)) {
                if (!ctx.req.permissions.can(AbilityAction.Update, subject("User", rowToUpdate), field)) {
                    this.logger.verbose("User does not have permission to update field " + field + ".");
                    ctx.req.passed = false;
                    return null;
                }
            }
        }

        // Hash the password if it is provided.
        if (data.password) {
            this.logger.verbose("Hashing password");
            data.password = await this.authService.hashPassword(data.password);
        }

        this.logger.verbose("Calling prisma.user.update.");
        const result = await prisma.user.update({ where: { id }, data });

        await prisma.genAuditLog({
            user: ctx?.req?.user ?? undefined,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    public async deleteUser(id: bigint, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<User> {
        this.logger.verbose("Received request to delete user with ID " + id + ".");

        const filters: Prisma.UserWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).User);
        }
        this.logger.verbose("Calling prisma.user.findFirst.");
        const rowToDelete = await prisma.user.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToDelete) {
            this.logger.verbose("User not found. Throwing BadRequestException.");
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (ctx?.req?.permissions) {
            this.logger.verbose("Checking whether user has permission to delete user " + id + ".");
            if (!ctx.req.permissions.can(AbilityAction.Delete, subject("User", rowToDelete))) {
                this.logger.verbose("User does not have permission to delete user " + id + ".");
                ctx.req.passed = false;
                return null;
            }
        }

        this.logger.verbose("Calling prisma.user.delete.");
        const result = await prisma.user.delete({
            where: {
                id
            }
        });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            oldValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    public userCount(
        prisma: PrismaTransaction,
        options?: { filter: FilterUserInput },
        ctx?: { req: Request }
    ): Promise<number> {
        this.logger.verbose("Received request to count users.");

        parseDateTimeInputs(options?.filter?.joined, ["equals", "gt", "gte", "lt", "lte", "not"]);

        const filters: Prisma.UserWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).User);
        }

        this.logger.verbose("Calling prisma.user.count.");
        return prisma.user.count({
            where: {
                AND: filters
            }
        });
    }
}
