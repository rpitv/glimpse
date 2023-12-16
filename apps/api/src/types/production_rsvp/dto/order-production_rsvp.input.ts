import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum ProductionRSVPOrderableFields {
    id = "id",
    willAttend = "willAttend"
}

registerEnumType(ProductionRSVPOrderableFields, {
    name: "ProductionRSVPOrderableFields"
});

/**
 * Input type for ordering ProductionRSVPs in ReadMany queries.
 */
@InputType()
export class OrderProductionRSVPInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => ProductionRSVPOrderableFields)
    field: ProductionRSVPOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
