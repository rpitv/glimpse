import {productionCancellation} from "./productions/productionCancellation";
import {productionCreator} from "./productions/productionCreator";
import {productionEditor} from "./productions/productionEditor";
import {unvolunteer} from "./productions/unvolunteer";
import {volunteer} from "./productions/volunteer";
import {CustomId} from "../types";

export const customIds: CustomId[] = [
    productionCancellation,
    productionCreator,
    productionEditor,
    unvolunteer,
    volunteer
]
