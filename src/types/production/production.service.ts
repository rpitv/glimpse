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

@Injectable()
export class ProductionService {
    private logger: Logger = new Logger("ProductionService");

    public async findManyProduction(
        prisma: PrismaTransaction,
        options?: {
            pagination: PaginationInput;
            filter?: FilterProductionInput;
            order?: OrderProductionInput[];
        },
        ctx?: { req: Request }
    ): Promise<Production[]> {
        // The "WHERE" filter is a combination of the provided filter and the user's permissions, depending on what is
        //  provided.
        const filters: Prisma.ProductionWhereInput[] = [];
        if (options?.filter) {
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            filters.push(accessibleBy(ctx.req.permissions).Production);
        }

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = options?.order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return prisma.production.findMany({
            where: { AND: filters },
            orderBy,
            skip: options?.pagination?.skip,
            take: Math.max(0, options?.pagination?.take ?? 20),
            cursor: options?.pagination?.cursor ? { id: BigInt(options?.pagination.cursor) } : undefined
        });
    }

    public async findOneProduction(id: bigint, prisma: PrismaTransaction, ctx?: { req: Request }): Promise<Production> {
        this.logger.verbose("Received request to find one production.");
        // We should check permissions only if a CASL Ability object is set within the request context.
        const shouldCheckPerms = !!ctx?.req?.permissions;
        const permsFilter = shouldCheckPerms ? [accessibleBy(ctx.req.permissions).Production] : [];
        return prisma.production.findFirst({
            where: {
                AND: [{ id }, ...permsFilter]
            }
        });
    }

    public async createProduction(
        data: CreateProductionInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<Production> {
        this.logger.verbose("Creating Production...");
        data = plainToClass(CreateProductionInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

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
        this.logger.verbose("Received request to update production.");
        data = plainToClass(UpdateProductionInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        // We should check permissions only if a CASL Ability object is set within the request context.
        const shouldCheckPerms = !!ctx?.req?.permissions;
        const permsFilter = shouldCheckPerms ? [accessibleBy(ctx.req.permissions).Production] : [];
        const rowToUpdate = await prisma.production.findFirst({
            where: {
                AND: [{ id }, ...permsFilter]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        if (shouldCheckPerms) {
            for (const field of Object.keys(data)) {
                if (!ctx.req.permissions.can(AbilityAction.Update, subject("Production", rowToUpdate), field)) {
                    ctx.req.passed = false;
                    return null;
                }
            }
        }

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
        this.logger.verbose("Received request to delete production.");

        // We should check permissions only if a CASL Ability object is set within the request context.
        const shouldCheckPerms = !!ctx?.req?.permissions;
        const permsFilter = shouldCheckPerms ? [accessibleBy(ctx.req.permissions).Production] : [];
        const rowToDelete = await prisma.production.findFirst({
            where: {
                AND: [{ id }, ...permsFilter]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (shouldCheckPerms) {
            if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Production", rowToDelete))) {
                ctx.req.passed = false;
                return null;
            }
        }

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
        // We should check permissions only if a CASL Ability object is set within the request context.
        const shouldCheckPerms = !!ctx?.req?.permissions;
        const permsFilter = shouldCheckPerms ? [accessibleBy(ctx.req.permissions).Production] : [];
        return prisma.production.count({
            where: {
                AND: [...permsFilter, options?.filter]
            }
        });
    }
}
