import { DirectiveLocation, getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLNonNull, GraphQLSchema } from "graphql";
import {
    GraphQLBoolean,
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLString
} from "graphql/type";
import { RuleDef, RuleType } from "./rule.decorator";
import { GraphQLAbilitySubjectsType } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { defer, firstValueFrom, Observable, tap } from "rxjs";
import { GraphQLResolverArgs } from "../gql/graphql-resolver-args.class";

/**
 * Injectable class for defining a GraphQL directive that can be used to apply CASL rules to a field. This directive
 *  operates almost identically to the @{@link Rule}() decorator, but is intended to be used in a GraphQL schema.
 *  The {@link Rule} decorator cannot be used in a GraphQL context as NestJS interceptors are only capable of
 *  encapsulating top-level resolver functions.
 *
 *  Currently, custom rule types are not supported by this directive.
 *
 *  @see {@link Rule} for HTTP counterpart and full documentation.
 *  @see {@link https://github.com/nestjs/graphql/issues/631}
 */
@Injectable()
export class RuleDirective {
    private logger: Logger = new Logger("RuleDirective");

    constructor(private readonly caslHelper: CaslHelper) {}

    create(schema: GraphQLSchema, directiveName: string) {
        return mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const rules = getDirective(schema, fieldConfig, directiveName);

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
                                    throw new ForbiddenException();
                                }

                                return result;
                            });
                        };

                        for (let i = rules.length - 1; i >= 0; i--) {
                            const rule: RuleDef = [rules[i].ruleType, rules[i].subject, rules[i].options];
                            const ruleNameStr = this.caslHelper.formatRuleName(rule);

                            // Cannot pass nextRuleFn directly as it'd pass by reference and cause infinite loop.
                            const nextTemp = nextRuleFn;
                            const handler = this.caslHelper.handlers.get(rule[0]);

                            // This should only happen if handlers is not set up properly to define a handler for every
                            //  RuleType.
                            if (!handler) {
                                throw new Error(`Unsupported rule type ${rule[0]} on ${ruleNameStr}.`);
                            }

                            nextRuleFn = () => {
                                this.logger.verbose(`Initializing rule handler for ${ruleNameStr}`);

                                return handler(resolverArgs, rule, nextTemp).pipe(
                                    tap((value) => {
                                        this.logger.verbose(`Rule handler for ${ruleNameStr} returned.`);

                                        // If the rule failed, throw a ForbiddenException. We check for req.passed as
                                        //  this allows the actual handler to set this value to true/false if it needs
                                        //  to. This is particularly applicable to mutation handlers
                                        //  (create/update/delete), where you may want to check permissions mid-database
                                        //  transaction.
                                        if (!context.req.passed) {
                                            this.logger.debug(
                                                `${ruleNameStr} failed (req.passed = ${context.req.passed}). Throwing 
                                                ForbiddenException.`
                                            );
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
 * A GraphQL enum type for the {@link RuleType} enum.
 */
export const GraphQLRuleType = new GraphQLEnumType({
    name: "RuleType",
    values: Object.keys(RuleType).reduce((values, type) => {
        values[type] = { value: type };
        return values;
    }, {})
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
        ruleType: {
            type: GraphQLRuleType
        },
        subject: {
            type: GraphQLAbilitySubjectsType
        },
        options: {
            // Based on RuleOptions type. Can't think of an easy way to infer this from the RuleOptions type.
            type: new GraphQLInputObjectType({
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
            })
        }
    }
});
