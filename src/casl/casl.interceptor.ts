import { CallHandler, ExecutionContext, ForbiddenException, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { firstValueFrom, Observable, tap } from "rxjs";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { RuleDef, RuleFn, RULES_METADATA_KEY, RuleType } from "./rules.decorator";
import { Reflector } from "@nestjs/core";
import { CaslHelper } from "./casl.helper";
import { PrismaService } from "../prisma/prisma.service";

/*
General CRUD steps:

Update:
- Check the user has permission to update at least one field on objects of the given type
- Check the user has permission to update all the supplied fields on objects of the given type
- Get the object to be updated
- Check the user has permission to update at least one field on the object
- Check the user has permission to update all the fields on the object
- Tentatively update the object via a transaction
- Check the user has permission to update at least one field on the object
- Check the user has permission to update all the fields on the object
- Save the transaction, or rollback if either of the previous two checks failed.

Create:
- Check the user has permission to create at least one field on objects of the given type
- Check the user has permission to create all the supplied fields on objects of the given type
- Tentatively create the object via a transaction
- Check the user has permission to create at least one field on the object
- Check the user has permission to create all the fields on the object, including defaults
- Save the transaction, or rollback if either of the previous two checks failed.

Delete:
- Check the user has permission to delete objects of the given type*
- Get the object to be deleted
- Check the user has permission to delete the object
- Delete the object

    *NOTE: Field-based permissions do not make sense in the context of record deletion. There should be constraints
    (either in code or the database itself) to specifically prevent field restrictions from being set on delete rules.

 */

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    private readonly handlers: Map<RuleType, RuleFn> = new Map([
        [RuleType.ReadOne, this.caslHelper.handleReadOneRule],
        [RuleType.ReadMany, this.caslHelper.handleReadManyRule],
        [RuleType.Count, this.caslHelper.handleCountRule],
        [RuleType.Custom, this.caslHelper.handleCustomRule],
        [RuleType.Create, this.caslHelper.handleCreateRule],
        [RuleType.Update, this.caslHelper.handleUpdateRule],
        [RuleType.Delete, this.caslHelper.handleDeleteRule]
    ]);

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly caslHelper: CaslHelper,
        private readonly prisma: PrismaService
    ) {}

    /**
     * Format a Rule's name into a string that can be used to identify it in logs.
     *  Returns a string in the format 'Rule "<name>"' for named rules, or 'Unnamed rule' for unnamed rules.
     * @param rule Rule to format the name of.
     * @private
     */
    private formatRuleName(rule: RuleDef): string {
        return rule[2]?.name ? `Rule "${rule[2].name}"` : "Unnamed rule";
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        const req = this.caslHelper.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug("User request does not yet have CASL ability generated. Generating now...");
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }

        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<RuleDef[]>(RULES_METADATA_KEY, context.getHandler());

        let nextRuleFn = next.handle;

        if (!rules || rules.length === 0) {
            this.logger.verbose("No rules applied for the given resource. Pass.");
        } else
            for (let i = rules.length - 1; i >= 0; i--) {
                const rule = rules[i];
                const ruleNameStr = this.formatRuleName(rule);

                // Cannot pass nextRuleFn directly as it'd pass by reference and cause infinite loop.
                const nextTemp = nextRuleFn;
                const handler = this.handlers.get(rule[0]);

                if (!handler) {
                    throw new Error(`Unsupported rule type ${rule[0]} on ${ruleNameStr}.`);
                }

                nextRuleFn = () => {
                    this.logger.verbose(`Initializing rule handler for ${ruleNameStr}`);

                    return handler(context, rule, nextTemp).pipe(
                        tap((value) => {
                            this.logger.verbose(`Rule handler for ${ruleNameStr} returned.`);

                            // If the rule failed, throw a ForbiddenException. We check for req.passed as this allows the actual
                            //  handler to set this value to true/false if it needs to. This is particularly applicable to mutation
                            //  handlers (create/update/delete), where you may want to check permissions mid-database transaction.
                            if (!req.passed) {
                                this.logger.debug(
                                    `${ruleNameStr} failed (req.passed = ${req.passed}). Throwing ForbiddenException.`
                                );
                                throw new ForbiddenException();
                            }

                            // Reset req.passed context variable.
                            delete req.passed;
                            return value;
                        })
                    );
                };
            }

        // Create a new Prisma transaction which can be used throughout the request. If any of the request's
        //  rules fail, or an error is thrown, the transaction will be rolled back. This isn't a very performant
        //  solution. https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions
        return this.prisma.$transaction(async (tx) => {
            req.prismaTx = tx;
            return firstValueFrom(nextRuleFn());
        });
    }
}
