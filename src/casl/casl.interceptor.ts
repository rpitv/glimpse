import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
    NestInterceptor
} from "@nestjs/common";
import { firstValueFrom, Observable } from "rxjs";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import {
    CaslAbilityFactory,
    GlimpseAbility
} from "./casl-ability.factory";
import { Rule, RULES_METADATA_KEY, RuleType } from "./rules.decorator";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { CaslHelper } from "./casl.helper";

/*
General CRUD steps:

Read one:

Read many:

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

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly caslHelper: CaslHelper
    ) {}

    /**
     * Retrieve the Express Request object from the current execution context. Currently only supports GraphQL and
     *  HTTP execution contexts. If the execution context is set to something else, this will throw an Error.
     * @param context Execution context to retrieve the Request object from.
     * @throws Error if execution context type is not GraphQL or HTTP.
     */
    getRequest(context: ExecutionContext): Request {
        if (context.getType<GqlContextType>() === "graphql") {
            this.logger.verbose(
                "CASL interceptor currently in GraphQL context."
            );
            const gqlContext = GqlExecutionContext.create(context);
            return gqlContext.getContext().req;
        } else if (context.getType() === "http") {
            this.logger.verbose("CASL interceptor currently in HTTP context.");
            return context.switchToHttp().getRequest();
        } else {
            throw new Error(
                `CASL interceptor applied to unsupported context type ${context.getType()}`
            );
        }
    }

    /**
     * Format a Rule's name into a string that can be used to identify it in logs.
     *  Returns a string in the format 'Rule "<name>"' for named rules, or 'Unnamed rule' for unnamed rules.
     * @param rule Rule to format the name of.
     * @private
     */
    private formatRuleName(rule: Rule): string {
        return rule.options?.name
            ? `Rule "${rule.options.name}"`
            : "Unnamed rule";
    }

    private testRules(
        context: ExecutionContext,
        rules: Rule[],
        ability: GlimpseAbility,
        value?: any
    ): void {
        if (!rules || rules.length === 0) {
            this.logger.verbose(
                "No rules applied for the given resource. Pass."
            );
            return;
        }

        for (const rule of rules) {
            const ruleNameStr = this.formatRuleName(rule);
            this.logger.verbose(`Testing ${ruleNameStr} without value.`);

            if (rule.type === RuleType.Custom) {
                this.logger.verbose("Calling testCustomRule.");
                if (
                    !this.caslHelper.testCustomRule(
                        context,
                        rule,
                        ability,
                        value
                    )
                ) {
                    this.logger.debug(
                        `${ruleNameStr} function returned false. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            } else if (rule.type === RuleType.ReadOne) {
                this.logger.verbose("Calling testReadOneRule.");
                if (
                    !this.caslHelper.testReadOneRule(
                        context,
                        rule,
                        ability,
                        value
                    )
                ) {
                    this.logger.debug(
                        `${ruleNameStr} failed. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            } else if (rule.type === RuleType.ReadMany) {
                this.logger.verbose("Calling testReadManyRule.");
                if (
                    !this.caslHelper.testReadManyRule(
                        context,
                        rule,
                        ability,
                        value
                    )
                ) {
                    this.logger.debug(
                        `${ruleNameStr} failed. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            } else if (
                rule.type === RuleType.Create ||
                rule.type === RuleType.Update ||
                rule.type === RuleType.Delete
            ) {
                this.logger.error(
                    "Mutational rules cannot be tested via @Rules() decorator because they " +
                        "must be tested mid-transaction."
                );
                throw new Error("Invalid @Rules() declaration");
            } else {
                throw new Error(
                    `Unsupported rule type ${rule.type} on ${ruleNameStr}.`
                );
            }
        }
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        const req = this.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug(
                "User request does not yet have CASL ability generated. Generating now..."
            );
            req.permissions = await this.caslAbilityFactory.createForUser(
                req.user
            );
        }

        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<Rule[]>(
            RULES_METADATA_KEY,
            context.getHandler()
        );

        this.testRules(context, rules, req.permissions);
        const value = await firstValueFrom(next.handle());
        this.logger.verbose("Method completed.");
        // Re-apply rules but with the actual return value passed in.
        // Note that conditional permission checks are limited to actual fields and not computed fields via
        //  @ResolveField(). There is no reasonable way to check these values for permissions.
        this.testRules(context, rules, req.permissions, value);
        return value;
    }
}
