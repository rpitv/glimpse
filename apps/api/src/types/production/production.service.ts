import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Production } from "./production.entity";
import { Prisma } from "@prisma/client";
import { CreateProductionInput } from "./dto/create-production.input";
import { UpdateProductionInput } from "./dto/update-production.input";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { PrismaTransaction } from "../../../@types/express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { subject } from "@casl/ability";
import { Request } from "express";
import { FilterProductionInput } from "./dto/filter-production.input";
import PaginationInput from "../../gql/pagination.input";
import { OrderProductionInput } from "./dto/order-production.input";
import { parseDateTimeInputs } from "src/util";

@Injectable()
export class ProductionService {
    private logger: Logger = new Logger("ProductionService");

    public async findManyProduction(
        prisma: PrismaTransaction,
        options?: {
            pagination?: PaginationInput;
            filter?: FilterProductionInput;
            order?: OrderProductionInput[];
        },
        ctx?: { req: Request }
    ): Promise<Production[]> {
        this.logger.debug(`Received request to find Productions. Options: ${JSON.stringify(options)}`);
        // The "WHERE" filter is a combination of the provided filter and the user's permissions, depending on what is
        //  provided.
        const filters: Prisma.ProductionWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }

        parseDateTimeInputs(options?.filter?.closetTime, ["equals", "gt", "gte", "lt", "lte", "not"]);
        parseDateTimeInputs(options?.filter?.startTime, ["equals", "gt", "gte", "lt", "lte", "not"]);
        parseDateTimeInputs(options?.filter?.endTime, ["equals", "gt", "gte", "lt", "lte", "not"]);

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = options?.order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        this.logger.verbose("Calling prisma.production.findMany.");
        return prisma.production.findMany({
            where: { AND: filters },
            orderBy,
            skip: options?.pagination?.skip,
            take: Math.max(0, options?.pagination?.take ?? 20),
            cursor: options?.pagination?.cursor ? { id: BigInt(options?.pagination.cursor) } : undefined
        });
    }

    public async findOneProduction(id: bigint, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<Production> {
        this.logger.debug("Received request to find Production with ID " + id + ".");

        const filters: Prisma.ProductionWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }

        this.logger.verbose("Calling prisma.production.findFirst.");
        return prisma.production.findFirst({
            where: {
                AND: filters
            }
        });
    }

    public async createProduction(
        data: CreateProductionInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<Production> {
        this.logger.debug("Received request to create a Production. Data: " + JSON.stringify(data));

        parseDateTimeInputs(data, ["closetTime", "startTime", "endTime"]);
        data = plainToClass(CreateProductionInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        this.logger.verbose("Calling prisma.production.create.");
        const result = await prisma.production.create({ data });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            newValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    public async updateProduction(
        id: bigint,
        data: UpdateProductionInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<Production> {
        this.logger.debug("Received request to update a Production. Data: " + JSON.stringify(data));

        parseDateTimeInputs(data, ["closetTime", "startTime", "endTime"]);
        data = plainToClass(UpdateProductionInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const filters: Prisma.ProductionWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }
        this.logger.verbose("Calling prisma.production.findFirst.");
        const rowToUpdate = await prisma.production.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToUpdate) {
            this.logger.verbose("Production not found. Throwing BadRequestException.");
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        if (ctx?.req?.permissions) {
            for (const field of Object.keys(data)) {
                if (!ctx.req.permissions.can(AbilityAction.Update, subject("Production", rowToUpdate), field)) {
                    this.logger.verbose("User does not have permission to update field " + field + ".");
                    ctx.req.passed = false;
                    return null;
                }
            }
        }

        this.logger.verbose("Calling prisma.production.update.");
        const result = await prisma.production.update({ where: { id }, data });

        await prisma.genAuditLog({
            user: ctx?.req?.user ?? undefined,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    public async deleteProduction(id: bigint, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<Production> {
        this.logger.verbose("Received request to delete production with ID " + id + ".");

        const filters: Prisma.ProductionWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }
        this.logger.verbose("Calling prisma.production.findFirst.");
        const rowToDelete = await prisma.production.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (ctx?.req?.permissions) {
            this.logger.verbose("Checking whether user has permission to delete production " + id + ".");
            if (!ctx.req.permissions.can(AbilityAction.Delete, subject("User", rowToDelete))) {
                this.logger.verbose("User does not have permission to delete production " + id + ".");
                ctx.req.passed = false;
                return null;
            }
        }

        this.logger.verbose("Calling prisma.production.delete.");
        const result = await prisma.production.delete({
            where: {
                id
            }
        });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            oldValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    public productionCount(
        prisma: PrismaTransaction,
        options?: { filter: FilterProductionInput },
        ctx?: { req: Request }
    ): Promise<number> {
        this.logger.verbose("Received request to count productions.");

        parseDateTimeInputs(options?.filter?.closetTime, ["equals", "gt", "gte", "lt", "lte", "not"]);
        parseDateTimeInputs(options?.filter?.startTime, ["equals", "gt", "gte", "lt", "lte", "not"]);
        parseDateTimeInputs(options?.filter?.endTime, ["equals", "gt", "gte", "lt", "lte", "not"]);

        const filters: Prisma.ProductionWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }

        this.logger.verbose("Calling prisma.user.count.");
        return prisma.production.count({
            where: {
                AND: filters
            }
        });
    }
}
