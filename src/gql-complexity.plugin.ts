import { ComplexityEstimatorArgs, GraphQLSchemaHost } from "@nestjs/graphql";
import { Plugin } from "@nestjs/apollo";
import { ApolloServerPlugin, GraphQLRequestListener } from "apollo-server-plugin-base";
import { GraphQLError } from "graphql";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import { Logger } from "@nestjs/common";

/**
 * Predefined complexity estimators that can be re-used in standard queries.
 */
export class Complexities {
    static FindOne(options: ComplexityEstimatorArgs): number {
        return 10 + options.childComplexity;
    }
    static FindMany(options: ComplexityEstimatorArgs): number {
        return 10 + (options.args.pagination?.take ?? 20) * options.childComplexity;
    }
}

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
    private readonly logger: Logger = new Logger("ComplexityPlugin");

    constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

    async requestDidStart(): Promise<GraphQLRequestListener> {
        // Complexity is quite subjective and cannot be outlined in a comment. Read the wiki page for more information
        //  on how complexity is calculated: https://github.com/rpitv/glimpse-api/wiki/Query-Complexity
        const maxComplexity = 500;
        const { schema } = this.gqlSchemaHost;

        return {
            didResolveOperation: async (options) => {
                const complexity = getComplexity({
                    schema,
                    operationName: options.request.operationName,
                    query: options.document,
                    variables: options.request.variables,
                    estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })]
                });

                this.logger.debug(`Query complexity: ${complexity}`);

                if (complexity > maxComplexity) {
                    throw new GraphQLError(
                        `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`
                    );
                }
            }
        };
    }
}
