import {GlimpseAbility} from "./casl-ability.factory";
import {SetMetadata} from "@nestjs/common";

export type RuleFn = (ability: GlimpseAbility) => boolean;
export const RULE_DECORATOR_KEY = 'casl_rule'
export const Rule = (...ruleFns: RuleFn[]) => SetMetadata(RULE_DECORATOR_KEY, ruleFns);
