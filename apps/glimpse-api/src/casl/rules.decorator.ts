import {AbilityAction, AbilitySubjects, GlimpseAbility} from "./casl-ability.factory";
import {SetMetadata} from "@nestjs/common";

export type RuleFn = (ability: GlimpseAbility) => boolean;
export type Rule = { name?: string, rule: RuleFn | [AbilityAction, AbilitySubjects?, string?] }
export type NonEmptyArray<T> = [T, ...T[]];
export const RULES_METADATA_KEY = 'casl_rule'

function Rules(name: string|null, ruleFn: RuleFn);
function Rules(
    name: string|null,
    action: AbilityAction,
    subject?: AbilitySubjects,
    field?: string
);
function Rules(rules: Rule[]);
function Rules(...args: any[])  {
    // Array of rules
    if(Array.isArray(args[0])) {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, args[0]);
    }
    // Rule function
    if(typeof args[1] === "function") {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [{
            name: args[0],
            rule: args[1]
        }])
    }
    // Rule array
    return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [{
        name: args[0],
        rule: [args[1], args[2], args[3]]
    }])
}

export { Rules }
