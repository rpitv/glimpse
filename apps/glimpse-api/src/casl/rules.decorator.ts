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
export type RuleDef = [
    AbilityAction,
    (AbilitySubjects | [AbilitySubjects])?,
    string?
];
export type Rule = {
    name?: string;
    rule: RuleFn | RuleDef;
    options?: RuleOptions;
};
export type RuleOptions = {
    inferFields?: boolean;
    excludeFields?: string[];
    checkValue?: boolean;
    muteFieldsWarning?: boolean;
};
export type NonEmptyArray<T> = [T, ...T[]];
export const RULES_METADATA_KEY = "casl_rule";

function Rules(name: string | null, ruleFn: RuleFn);
function Rules(
    name: string | null,
    action: AbilityAction,
    subject?: AbilitySubjects | [AbilitySubjects],
    field?: string
);
function Rules(rules: Rule[]);
function Rules(...args: any[]) {
    // Array of rules
    if (Array.isArray(args[0])) {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, args[0]);
    }
    // Rule function
    if (typeof args[1] === "function") {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [
            {
                name: args[0],
                rule: args[1]
            }
        ]);
    }
    // Rule array
    return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [
        {
            name: args[0],
            rule: [args[1], args[2], args[3]]
        }
    ]);
}

export { Rules };
