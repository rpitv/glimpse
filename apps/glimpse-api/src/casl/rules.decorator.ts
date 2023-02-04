import {AbilitySubjects} from "./casl-ability.factory";
import {ExecutionContext, SetMetadata} from "@nestjs/common";
import {Observable} from "rxjs";

export type RuleFn<T = any> = (context: ExecutionContext, rule: RuleDef, handler: () => Observable<T>) => Observable<T>;
export type RuleDef =
    [RuleType.Custom, RuleFn, RuleOptions?]
    | [Exclude<RuleType, RuleType.Custom>, AbilitySubjects, RuleOptions?];

export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Count = "Count",
    Custom = "Custom"
}

export type RuleOptions = {
    name?: string;
    excludeFields?: string[];
    checkValue?: boolean;
    orderInputName?: string;
    filterInputName?: string;
    paginationInputName?: string;
    inputName?: string;
    strict?: boolean;
};
export const RULES_METADATA_KEY = "casl_rule";

function Rule(type: RuleType.Custom, fn: RuleFn, options?: RuleOptions);
function Rule(type: Exclude<RuleType, RuleType.Custom>, subject: AbilitySubjects, options?: RuleOptions);
function Rule(rules: RuleDef[]);
function Rule(...args: any) {
    // Multiple rule definitions supplied
    if (Array.isArray(args[0])) {
        return SetMetadata<string, RuleDef[]>(RULES_METADATA_KEY, args[0]);
    }

    // Single rule definition supplied
    args[2] ||= {};
    return SetMetadata<string, RuleDef[]>(RULES_METADATA_KEY, [args]);
}

export {Rule};
