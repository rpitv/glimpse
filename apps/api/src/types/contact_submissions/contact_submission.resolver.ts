import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { isObject, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { ContactSubmission } from "./contact_submission.entity";
import { FilterContactSubmissionInput } from "./dto/filter-contact_submission.input";
import { OrderContactSubmissionInput } from "./dto/order-contact_submission.input";
import { CreateContactSubmissionProductionRequestInput } from "./dto/create-contact_submission-production-request.input";
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";
import * as process from "process";
import { CreateContactSubmissionGeneralInput } from "./dto/create-contact_submission-general.input";
import { ContactSubmissionType } from "@prisma/client";
import { UpdateContactSubmissionGeneralInput } from "./dto/update-contact_submission-general.input";
import { UpdateContactSubmissionProductionRequestInput } from "./dto/update-contact_submission-production-request.input";

type CreateContactSubmissionInput = Omit<ContactSubmission, "id" | "timestamp">;
type UpdateContactSubmissionInput = Partial<CreateContactSubmissionInput>;

@Resolver(() => ContactSubmission)
export class ContactSubmissionResolver {
    private logger: Logger = new Logger("ContactSubmissionResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ContactSubmission], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, ContactSubmission)
    async findManyContactSubmission(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterContactSubmissionInput, nullable: true })
        filter?: FilterContactSubmissionInput,
        @Args("order", { type: () => [OrderContactSubmissionInput], nullable: true })
        order?: OrderContactSubmissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ContactSubmission[]> {
        this.logger.verbose("findManyContactSubmission resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ContactSubmission, filter].filter(v => v !== undefined)
              }
            : accessibleBy(ctx.req.permissions).ContactSubmission;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.contactSubmission.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => ContactSubmission, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, ContactSubmission)
    async findOneContactSubmission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ContactSubmission> {
        this.logger.verbose("findOneContactSubmission resolver called");
        return ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, ContactSubmission)
    async deleteContactSubmission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ContactSubmission> {
        this.logger.verbose("deleteContactSubmission resolver called");

        const rowToDelete = await ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ContactSubmission not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ContactSubmission", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.contactSubmission.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, ContactSubmission)
    async contactSubmissionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterContactSubmissionInput, nullable: true })
        filter?: FilterContactSubmissionInput
    ): Promise<number> {
        return ctx.req.prismaTx.contactSubmission.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ContactSubmission, filter].filter(v => v !== undefined)
            }
        });
    }

    // -------------------- Custom Resolvers --------------------

    @Mutation(() => Boolean, { complexity: Complexities.Create })
    @Rule(RuleType.CreateInvisible, ContactSubmission)
    async createContactSubmissionGeneral(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateContactSubmissionGeneralInput }) input: CreateContactSubmissionGeneralInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("createContactSubmissionGeneral resolver called");
        const result = await this.genericCreateContactSubmission(
            ctx,
            plainToClass(ContactSubmission, {
                email: input.email,
                type: ContactSubmissionType.GENERAL,
                name: input.name,
                subject: input.subject,
                body: input.body,
                resolved: input.resolved,
                additionalData: {}
            })
        );
        this.handleNewSubmissionNotifications(result);
        return result;
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ContactSubmission)
    async updateContactSubmissionGeneral(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateContactSubmissionGeneralInput }) input: UpdateContactSubmissionGeneralInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("updateContactSubmissionGeneral resolver called");

        return await this.genericUpdateContactSubmission(
            ctx,
            id,
            plainToClass(ContactSubmission, {
                ...input,
                type: ContactSubmissionType.GENERAL,
                additionalData: {}
            })
        );
    }
    @Mutation(() => Boolean, { complexity: Complexities.Create })
    @Rule(RuleType.CreateInvisible, ContactSubmission)
    async createContactSubmissionProductionRequest(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateContactSubmissionProductionRequestInput })
        input: CreateContactSubmissionProductionRequestInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("createContactSubmissionProductionRequest resolver called");

        const result = await this.genericCreateContactSubmission(
            ctx,
            plainToClass(ContactSubmission, {
                email: input.email,
                type: ContactSubmissionType.PRODUCTION_REQUEST,
                name: input.name,
                subject: input.subject,
                body: input.body,
                resolved: input.resolved,
                additionalData: this.generateProductionRequestAdditionalData(input)
            })
        );
        this.handleNewSubmissionNotifications(result);
        return result;
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ContactSubmission)
    async updateContactSubmissionProductionRequest(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateContactSubmissionProductionRequestInput })
        input: UpdateContactSubmissionProductionRequestInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("updateContactSubmissionProductionRequest resolver called");

        return await this.genericUpdateContactSubmission(
            ctx,
            id,
            plainToClass(ContactSubmission, {
                ...input,
                type: ContactSubmissionType.PRODUCTION_REQUEST,
                additionalData: this.generateProductionRequestAdditionalData(input)
            })
        );
    }

    // --------------------------- Helpers ------------------------

    private async genericCreateContactSubmission(ctx: { req: Request }, input: CreateContactSubmissionInput) {
        console.log(input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        // Default non-object additional data (including null/undefined) to just an empty object
        if (!isObject(input.additionalData)) {
            input.additionalData = {};
        }

        const result = await ctx.req.prismaTx.contactSubmission.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    private async genericUpdateContactSubmission(
        ctx: { req: Request },
        id: bigint,
        input: UpdateContactSubmissionInput
    ) {
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("ContactSubmission not found");
        }

        if (rowToUpdate.type !== input.type) {
            throw new BadRequestException(`ContactSubmission is not of type ${input.type}`);
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("ContactSubmission", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        // Default non-object additional data (including null/undefined) to just an empty object
        if (!isObject(rowToUpdate.additionalData)) {
            rowToUpdate.additionalData = {};
        }
        if (!isObject(input.additionalData)) {
            input.additionalData = {};
        }

        // Combine the `additionalData` value with the current value. We don't want to overwrite the entire
        //  object if only some values have changed.
        input.additionalData = {
            ...rowToUpdate.additionalData,
            ...input.additionalData
        };

        const result = await ctx.req.prismaTx.contactSubmission.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    private handleNewSubmissionNotifications(submission: ContactSubmission) {
        // Send message to discord
        if (process.env.DISCORD_WEBHOOK) {
            console.log("Sending Discord msg")
            let msg: any;
            if (submission.type === ContactSubmissionType.PRODUCTION_REQUEST) {
                const additionalData = submission.additionalData as any;
                msg = {
                    embeds: [
                        {
                            title: "New Production Request",
                            url: `https://rpi.tv/dashboard/contact-submissions/${submission.id}`,
                            timestamp: submission.timestamp,
                            color: 0xff0000,
                            fields: [
                                {
                                    name: "Event Name",
                                    value: submission.subject
                                },
                                {
                                    name: "Organization",
                                    value: additionalData.organizationName
                                },
                                {
                                    name: "Name",
                                    value: submission.name
                                },
                                {
                                    name: "Email",
                                    value: submission.email
                                },
                                {
                                    name: "Phone Number",
                                    value: additionalData.phoneNumber ?? "*Unanswered*"
                                },
                                {
                                    name: "Location",
                                    value: additionalData.location
                                },
                                {
                                    name: "Start Time",
                                    value: new Date(additionalData.startTime).toLocaleString("en-US", { timeZone: "EST"})
                                },
                                {
                                    name: "End Time",
                                    value: new Date(additionalData.endTime).toLocaleString("en-US", { timeZone: "EST"})
                                },
                                {
                                    name: "Would you like this event livestreamed?",
                                    value: additionalData.livestreamed ? "Yes" : "No"
                                },
                                {
                                    name: "What is the source of your audio?",
                                    value: additionalData.audioSource ?? "None"
                                },
                                {
                                    name: "Is your organization part of the Student Union?",
                                    value: additionalData.isStudentOrganization ? "Yes" : "No"
                                },
                                {
                                    name: "Additional Details",
                                    value: submission.body.length ? submission.body : "*Unanswered*"
                                }
                            ]
                        }
                    ]
                };
            } else {
                msg = {
                    embeds: [
                        {
                            title: "New Contact Submission",
                            url: `https://rpi.tv/dashboard/contact-submissions/${submission.id}`,
                            timestamp: submission.timestamp,
                            color: 0xff0000,
                            fields: [
                                {
                                    name: "Subject",
                                    value: submission.subject
                                },
                                {
                                    name: "Name",
                                    value: submission.name
                                },
                                {
                                    name: "Email",
                                    value: submission.email
                                },
                                {
                                    name: "Body",
                                    value: submission.body
                                }
                            ]
                        }
                    ]
                };
            }
            fetch(process.env.DISCORD_WEBHOOK, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(msg)
            }).catch(() => {
                this.logger.error(`Failed to send Discord notification for new ContactSubmission (ID ${submission.id})`);
            });
        }
    }

    /**
     * Convert a Production Request input value into the additionalData value.
     * @param input Input create/update values
     * @returns An object that should be used as the `additionalData` for the contact submission. Note, in the case of
     * `input` being a `UpdateContactSubmissionProductionRequestInput`, the returned value will only contain the values
     * which are being updated. The returned value can be merged with the already-present value so data which isn't
     * updated isn't overwritten.
     * @private
     */
    private generateProductionRequestAdditionalData(
        input: CreateContactSubmissionProductionRequestInput | UpdateContactSubmissionProductionRequestInput
    ) {
        return {
            location: input.location,
            organizationName: input.organizationName,
            startTime: input.startTime?.toISOString(),
            endTime: input.endTime?.toISOString(),
            livestreamed: input.livestreamed,
            isPublic: input.isPublic,
            audioSource: input.audioSource,
            isStudentOrganization: input.isStudentOrganization,
            phoneNumber: input.phoneNumber
        };
    }
}
