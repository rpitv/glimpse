import { GraphQLResolveInfo } from "graphql/type";

export class GraphQLResolverArgs {
    public readonly source: any;
    public readonly args: any;
    public readonly context: any;
    public readonly info: GraphQLResolveInfo;

    constructor(source: any, args: any, context: any, info: GraphQLResolveInfo) {
        this.source = source;
        this.args = args;
        this.context = context;
        this.info = info;
    }
}
