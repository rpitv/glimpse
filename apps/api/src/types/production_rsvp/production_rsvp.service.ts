import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma, ProductionRSVP } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { PrismaTransaction } from "../../../@types/express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { subject } from "@casl/ability";
import { Request } from "express";
import PaginationInput from "../../gql/pagination.input";
import { parseDateTimeInputs } from "src/util";
import { FilterProductionRSVPInput } from "./dto/filter-production_rsvp.input";
import { OrderProductionRSVPInput } from "./dto/order-production_rsvp.input";
import { CreateProductionRSVPInput } from "./dto/create-production_rsvp.input";
import { UpdateProductionRSVPInput } from "./dto/update-production_rsvp.input";

@Injectable()
export class ProductionRSVPService {
    private logger: Logger = new Logger("ProductionRSVPService");

    public async findManyProductionRSVP(
        prisma: PrismaTransaction,
        options?: {
            pagination?: PaginationInput;
            filter?: FilterProductionRSVPInput;
            order?: OrderProductionRSVPInput[];
        },
        ctx?: { req: Request }
    ): Promise<ProductionRSVP[]> {
        this.logger.debug(`Received request to find ProductionRSVPs. Options: ${JSON.stringify(options)}`);
        // The "WHERE" filter is a combination of the provided filter and the user's permissions, depending on what is
        //  provided.
        const filters: Prisma.ProductionRSVPWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).ProductionRSVP);
        }

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = options?.order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        this.logger.verbose("Calling prisma.productionRSVP.findMany.");
        return prisma.productionRSVP.findMany({
            where: { AND: filters },
            orderBy,
            skip: options?.pagination?.skip,
            take: Math.max(0, options?.pagination?.take ?? 20),
            cursor: options?.pagination?.cursor ? { id: BigInt(options?.pagination.cursor) } : undefined
        });
    }

    public async findOneProductionRSVP(
        id: bigint,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<ProductionRSVP> {
        this.logger.debug("Received request to find ProductionRSVP with ID " + id + ".");

        const filters: Prisma.ProductionRSVPWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).ProductionRSVP);
        }

        this.logger.verbose("Calling prisma.productionRSVP.findFirst.");
        return prisma.productionRSVP.findFirst({
            where: {
                AND: filters
            }
        });
    }

    public async createProductionRSVP(
        data: CreateProductionRSVPInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<ProductionRSVP> {
        this.logger.debug("Received request to create a ProductionRSVP. Data: " + JSON.stringify(data));

        parseDateTimeInputs(data, ["closetTime", "startTime", "endTime"]);
        data = plainToClass(CreateProductionRSVPInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        this.logger.verbose("Calling prisma.productionRSVP.create.");
        const result = await prisma.productionRSVP.create({ data });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            newValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    public async updateProductionRSVP(
        id: bigint,
        data: UpdateProductionRSVPInput,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<ProductionRSVP> {
        this.logger.debug("Received request to update a ProductionRSVP. Data: " + JSON.stringify(data));

        parseDateTimeInputs(data, ["closetTime", "startTime", "endTime"]);
        data = plainToClass(UpdateProductionRSVPInput, data);
        const errors = await validate(data, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            this.logger.debug("Validation failed. Throwing BadRequestException. Error: " + firstErrorFirstConstraint);
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const filters: Prisma.ProductionRSVPWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).ProductionRSVP);
        }
        this.logger.verbose("Calling prisma.productionRSVP.findFirst.");
        const rowToUpdate = await prisma.productionRSVP.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToUpdate) {
            this.logger.verbose("ProductionRSVP not found. Throwing BadRequestException.");
            throw new BadRequestException("ProductionRSVP not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        if (ctx?.req?.permissions) {
            for (const field of Object.keys(data)) {
                if (!ctx.req.permissions.can(AbilityAction.Update, subject("ProductionRSVP", rowToUpdate), field)) {
                    this.logger.verbose("User does not have permission to update field " + field + ".");
                    ctx.req.passed = false;
                    return null;
                }
            }
        }

        this.logger.verbose("Calling prisma.productionRSVP.update.");
        const result = await prisma.productionRSVP.update({ where: { id }, data });

        await prisma.genAuditLog({
            user: ctx?.req?.user ?? undefined,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    public async deleteProductionRSVP(
        id: bigint,
        prisma: PrismaTransaction,
        ctx?: { req: Request }
    ): Promise<ProductionRSVP> {
        this.logger.verbose("Received request to delete productionRSVP with ID " + id + ".");

        const filters: Prisma.ProductionRSVPWhereInput[] = [{ id }];
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).ProductionRSVP);
        }
        this.logger.verbose("Calling prisma.productionRSVP.findFirst.");
        const rowToDelete = await prisma.productionRSVP.findFirst({
            where: {
                AND: filters
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ProductionRSVP not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (ctx?.req?.permissions) {
            this.logger.verbose("Checking whether user has permission to delete productionRSVP " + id + ".");
            if (!ctx.req.permissions.can(AbilityAction.Delete, subject("User", rowToDelete))) {
                this.logger.verbose("User does not have permission to delete productionRSVP " + id + ".");
                ctx.req.passed = false;
                return null;
            }
        }

        this.logger.verbose("Calling prisma.productionRSVP.delete.");
        const result = await prisma.productionRSVP.delete({
            where: {
                id
            }
        });

        await prisma.genAuditLog({
            user: ctx?.req?.user,
            oldValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    public productionRSVPCount(
        prisma: PrismaTransaction,
        options?: { filter: FilterProductionRSVPInput },
        ctx?: { req: Request }
    ): Promise<number> {
        this.logger.verbose("Received request to count productionRSVPs.");

        const filters: Prisma.ProductionRSVPWhereInput[] = [];
        if (options?.filter) {
            this.logger.verbose("Filter found in options. Adding to filter.");
            filters.push(options.filter);
        }
        if (ctx?.req?.permissions) {
            this.logger.verbose("Permissions found in request context. Adding to filter.");
            filters.push(accessibleBy(ctx.req.permissions).ProductionRSVP);
        }

        this.logger.verbose("Calling prisma.user.count.");
        return prisma.productionRSVP.count({
            where: {
                AND: filters
            }
        });
    }
}
