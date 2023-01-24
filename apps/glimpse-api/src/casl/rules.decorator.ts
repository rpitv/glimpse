import {
    AbilityAction,
    AbilitySubjects,
    GlimpseAbility
} from "./casl-ability.factory";
import { ExecutionContext, SetMetadata } from "@nestjs/common";

export type RuleFn = (
    ability: GlimpseAbility,
    context: ExecutionContext,
    value?: any
) => boolean;
export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Custom = "Custom"
}
export type Rule = {
    name?: string;
    rule: RuleFn
    type: RuleType.Custom,
    options?: RuleOptions
} | {
    name?: string;
    rule: [AbilityAction, AbilitySubjects]
    type: Exclude<RuleType, RuleType.Custom>,
    options?: RuleOptions

};
export type RuleOptions = {
    inferFields?: boolean;
    excludeFields?: string[];
    checkValue?: boolean;
    muteFieldsWarning?: boolean;
};
export const RULES_METADATA_KEY = "casl_rule";

function Rules(name: string | null, type: RuleType.Custom, rule: RuleFn, options?: RuleOptions)
function Rules(name: string | null, type: Exclude<RuleType, RuleType.Custom>, rule: [AbilityAction, AbilitySubjects], options?: RuleOptions)
function Rules(rules: Rule[]);
function Rules(...args: any[]) {
    // Array of rules
    if (Array.isArray(args[0])) {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, args[0]);
    }
    // Single rule
    return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [
        {
            name: args[0],
            type: args[1],
            rule: args[2],
            options: args[3]
        }
    ])
}

export { Rules };
