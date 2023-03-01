import { DirectiveLocation, getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLNonNull, GraphQLSchema } from "graphql";
import {
    GraphQLBoolean,
    GraphQLDirective,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLString
} from "graphql/type";
import { AbilitySubjects, GraphQLAbilitySubjectsType } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { defer, firstValueFrom, Observable, tap } from "rxjs";
import { GraphQLResolverArgs } from "../gql/graphql-resolver-args.class";
import { getRuleHandler, RuleDef, RuleHandler, RuleOptions } from "./rule.decorator";

/**
 * Injectable class for defining the GraphQL directives that can be used to apply CASL rules to a field. This is an
 *  underlying implementation. In reality, you'll probably want to use the {@link Rule} decorator instead, which
 *  is just a type-safe wrapper for applying these directives. Thus, you may find more complete documentation within
 *  the {@link Rule} decorator.
 *
 * These directives can only be applied to GraphQL resolvers, not HTTP controllers. If you need to apply rules to an
 *  HTTP controller, you will need to implement an interceptor which calls the underlying logic within
 *  {@link CaslHelper}. For a partial implementation, see the old @Rule decorator implemented with an interceptor at
 *  {@link https://github.com/rpitv/glimpse-api/tree/03f73f9db27959b07ad83028ae4521187b153ba6/src/casl}. This
 *  interceptor was deprecated and removed due to being untested and not being needed. For more information, please
 *  read the wiki.
 *
 * @see {@link https://github.com/rpitv/glimpse-api/tree/03f73f9db27959b07ad83028ae4521187b153ba6/src/casl}
 * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
 * @see {@link https://github.com/nestjs/graphql/issues/631}
 * @see {@link Rule} for type-safe wrapper
 */
@Injectable()
export class RuleDirective {
    private logger: Logger = new Logger("RuleDirective");

    constructor(private readonly caslHelper: CaslHelper) {}

    createBasic(schema: GraphQLSchema, directiveName: string) {
        return mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                type RuleInput = {
                    id: string;
                    subject: Extract<AbilitySubjects, string> | null;
                    options?: RuleOptions;
                };
                const rules: RuleInput[] = getDirective(schema, fieldConfig, directiveName) as RuleInput[];

                if (rules && rules.length > 0) {
                    const { resolve = defaultFieldResolver } = fieldConfig;

                    // Replace the original resolver with a function that *first* calls
                    // the original resolver, then converts its result to upper case
                    fieldConfig.resolve = async (source, args, context, info) => {
                        const resolverArgs = new GraphQLResolverArgs(source, args, context, info);
                        let nextRuleFn = (): Observable<any> => {
                            return defer(async () => {
                                const result = resolve(source, args, context, info);
                                // If the resolver explicitly said that the request should fail, throw a
                                //  ForbiddenException.
                                if (context.req.passed === false) {
                                    this.logger.debug(
                                        `Resolver failed (req.passed = ${context.req.passed}). Throwing 
                                        ForbiddenException.`
                                    );
                                    // Reset req.passed context variable.
                                    delete context.req.passed;
                                    throw new ForbiddenException();
                                }

                                return result;
                            });
                        };

                        for (let i = rules.length - 1; i >= 0; i--) {
                            const handler: RuleHandler = getRuleHandler(rules[i].id);
                            const rule: RuleDef = {
                                fn: handler,
                                subject: rules[i].subject,
                                options: rules[i].options
                            };
                            const ruleNameStr = this.caslHelper.formatRuleName(rule);

                            // Cannot pass nextRuleFn directly as it'd pass by reference and cause infinite loop.
                            const nextTemp = nextRuleFn;

                            nextRuleFn = () => {
                                this.logger.verbose(`Initializing rule handler for ${ruleNameStr}`);

                                return rule.fn(resolverArgs, rule, nextTemp, this.caslHelper).pipe(
                                    tap((value) => {
                                        this.logger.verbose(`Rule handler for ${ruleNameStr} returned.`);

                                        // If the rule failed, throw a ForbiddenException. We check for req.passed as
                                        //  this allows the actual ruleHandler to set this value to true/false if it needs
                                        //  to. This is particularly applicable to mutation handlers
                                        //  (create/update/delete), where you may want to check permissions mid-database
                                        //  transaction.
                                        if (!context.req.passed) {
                                            this.logger.debug(
                                                `${ruleNameStr} failed (req.passed = ${context.req.passed}). Throwing 
                                                ForbiddenException.`
                                            );
                                            // Reset req.passed context variable.
                                            delete context.req.passed;
                                            throw new ForbiddenException();
                                        }

                                        // Reset req.passed context variable.
                                        delete context.req.passed;
                                        return value;
                                    })
                                );
                            };
                        }

                        return await firstValueFrom(nextRuleFn());
                    };
                    return fieldConfig;
                }
            }
        });
    }
}

/**
 * Based on {@link RuleOptions} type. Can't think of an easy way to infer this from the RuleOptions type.
 */
export const GraphQLRuleOptionsInput = new GraphQLInputObjectType({
    name: "RuleOptions",
    fields: {
        name: {
            type: GraphQLString
        },
        excludeFields: {
            type: new GraphQLList(new GraphQLNonNull(GraphQLString))
        },
        orderInputName: {
            type: GraphQLString
        },
        filterInputName: {
            type: GraphQLString
        },
        paginationInputName: {
            type: GraphQLString
        },
        inputName: {
            type: GraphQLString
        },
        strict: {
            type: GraphQLBoolean
        },
        defer: {
            type: GraphQLBoolean
        }
    }
});

/**
 * GraphQL rule directive definition which is passed to the GraphQL module in app.module.ts. This directive can be
 *  applied to field resolvers to apply a rule to the field. We use this instead of the @Rule decorator because
 *  of limitations with NestJS interceptors in GraphQL contexts.
 *  @see {@link https://github.com/nestjs/graphql/issues/631}
 */
export const GraphQLRuleDirective = new GraphQLDirective({
    name: "rule",
    locations: [DirectiveLocation.FIELD_DEFINITION],
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        subject: {
            type: GraphQLAbilitySubjectsType
        },
        options: {
            type: GraphQLRuleOptionsInput
        }
    }
});
