import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";
import {BooleanComparisonInput} from "../../generic/boolean-comparison.input";

/**
 * Input type for filtering Assets in ReadMany queries.
 */
@InputType()
export class FilterAssetInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by tag number
     */
    tag?: NumberComparisonInput;
    /**
     * Filter by human-readable name
     */
    name?: StringComparisonInput;
    /**
     * Filter by the last known location of the asset
     */
    lastKnownLocation?: StringComparisonInput;
    /**
     * Filter by the last known handler of the asset
     */
    lastKnownHandlerId?: NumberComparisonInput;
    /**
     * Filter by whether the asset is lost or not
     */
    isLost?: BooleanComparisonInput;
    /**
     * Filter by the notes associated with the asset
     */
    notes?: StringComparisonInput;
    /**
     * Filter by the purchase price of the asset
     */
    purchasePrice?: NumberComparisonInput;
    /**
     * Filter by where the asset was purchased
     */
    purchaseLocation?: StringComparisonInput;
    /**
     * Filter by when the asset was purchased
     */
    purchaseDate?: DateComparisonInput;
    /**
     * Filter by the model number of the asset
     */
    modelNumber?: StringComparisonInput;
    /**
     * Filter by the serial number of the asset
     */
    serialNumber?: StringComparisonInput;
    /**
     * Filter by the parent asset of the asset
     */
    parentId?: NumberComparisonInput;

    AND?: FilterAssetInput[];
    OR?: FilterAssetInput[];
    NOT?: FilterAssetInput;
}
