import { AbilityAction, AbilitySubjects, GlimpseAbility } from "./casl-ability.factory";
import { ExecutionContext, SetMetadata } from "@nestjs/common";

export type RuleFn = (ability: GlimpseAbility, context: ExecutionContext, value?: any) => boolean;
export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Custom = "Custom"
}
export type Rule =
    | {
          rule: RuleFn;
          type: RuleType.Custom;
          options?: RuleOptions;
      }
    | {
          rule: [AbilityAction, AbilitySubjects];
          type: Exclude<RuleType, RuleType.Custom>;
          options?: RuleOptions;
      };
export type RuleOptions = {
    name?: string;
    excludeFields?: string[];
    checkValue?: boolean;
    orderInputName?: string;
    filterInputName?: string;
    inputName?: string;
    strict?: boolean;
};
export const RULES_METADATA_KEY = "casl_rule";

function Rules(type: RuleType.Custom, rule: RuleFn, options?: RuleOptions);
function Rules(type: Exclude<RuleType, RuleType.Custom>, subject: AbilitySubjects, options?: RuleOptions);
function Rules(type: Exclude<RuleType, RuleType.Custom>, rule: [AbilityAction, AbilitySubjects], options?: RuleOptions);
function Rules(rules: Rule[]);
function Rules(...args: any[]) {
    // Array of rules
    if (Array.isArray(args[0])) {
        return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, args[0]);
    }

    args[2] ||= {};

    // Single rule
    // Custom function-based rules and rules with an explicitly defined
    //  action type require no processing.
    if (args[0] === RuleType.Custom || Array.isArray(args[1])) {
        // Default rule name based on the requirements if it wasn't supplied
        if (args[0] === RuleType.Custom) {
            args[2].name ||= "Custom rule";
        } else {
            args[2].name ||= `${args[0]} (${args[1][0]}) ${args[1][1]}`;
        }

        return SetMetadata<string, Rule>(RULES_METADATA_KEY, {
            type: args[0],
            rule: args[1],
            options: args[2]
        });
    }

    // Supplying action is often redundant since it's already in the RuleType,
    //  so optionally the user can just pass a subject instead and we'll
    //  infer the action from the RuleType.
    let inferredAction = args[0];
    if (inferredAction === RuleType.ReadMany || inferredAction === RuleType.ReadOne) {
        inferredAction = AbilityAction.Read;
    }
    inferredAction = inferredAction.toLowerCase() as AbilityAction;
    // Default rule name based on the requirements if it wasn't supplied
    args[2].name ||= `${args[0]} ${args[1].modelName || args[1].name || args[1]}`;

    return SetMetadata<string, Rule[]>(RULES_METADATA_KEY, [
        {
            type: args[0],
            rule: [inferredAction, args[1]],
            options: args[2]
        }
    ]);
}

export { Rules };
