import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import { BooleanComparisonInput } from "../../../gql/boolean-comparison.input";
import {OrderDirection} from "../../../gql/order-direction.enum";

/**
 * Input type for filtering Assets in ReadMany queries.
 */
@InputType()
export class FilterAssetInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by tag number
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    tag?: NumberComparisonInput;
    /**
     * Filter by human-readable name
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by the last known location of the asset
     */
    @Field(() => StringComparisonInput, { nullable: true })
    lastKnownLocation?: StringComparisonInput;
    /**
     * Filter by the last known handler of the asset
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    lastKnownHandlerId?: NumberComparisonInput;
    /**
     * Filter by whether the asset is lost or not
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    isLost?: BooleanComparisonInput;
    /**
     * Filter by the notes associated with the asset
     */
    @Field(() => StringComparisonInput, { nullable: true })
    notes?: StringComparisonInput;
    /**
     * Filter by the purchase price of the asset
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    purchasePrice?: NumberComparisonInput;
    /**
     * Filter by where the asset was purchased
     */
    @Field(() => StringComparisonInput, { nullable: true })
    purchaseLocation?: StringComparisonInput;
    /**
     * Filter by when the asset was purchased
     */
    @Field(() => DateComparisonInput, { nullable: true })
    purchaseDate?: DateComparisonInput;
    /**
     * Filter by the model number of the asset
     */
    @Field(() => StringComparisonInput, { nullable: true })
    modelNumber?: StringComparisonInput;
    /**
     * Filter by the serial number of the asset
     */
    @Field(() => StringComparisonInput, { nullable: true })
    serialNumber?: StringComparisonInput;
    /**
     * Filter by the parent asset of the asset
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    parentId?: NumberComparisonInput;

    @Field(() => [FilterAssetInput], { nullable: true })
    AND?: FilterAssetInput[];
    @Field(() => [FilterAssetInput], { nullable: true })
    OR?: FilterAssetInput[];
    @Field(() => [FilterAssetInput], { nullable: true })
    NOT?: FilterAssetInput;
}
