import { map, Observable } from "rxjs";
import { subject } from "@casl/ability";
import { AbilityAction } from "../casl-ability.factory";
import { ExecutionContext, Logger } from "@nestjs/common";
import { GraphQLResolverArgs } from "../../gql/graphql-resolver-args.class";
import { RuleDef } from "../rule.decorator";
import { CaslHelper } from "../casl.helper";
import { PermissionUnion } from "../../types/user_permission/user_permission.resolver";

const logger = new Logger("PermissionsForRuleHandler");

export function handlePermissionsForRule(
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<(typeof PermissionUnion)[]>,
    caslHelper: CaslHelper
): Observable<(typeof PermissionUnion)[]> {
    logger.verbose("permissionsFor custom rule handler called");
    const req = caslHelper.getRequest(context);
    const fields = caslHelper.getSelectedFields(context);

    const selectedFields: Record<"UserPermission" | "GroupPermission", string[]> = {
        UserPermission: [],
        GroupPermission: []
    };

    // Sanitize the fields to ensure that only the fields that are actually selected are checked. Then,
    //  check if the user has the ability to read the field. Sanitization simplifies later checks.
    for (const fieldAndType of fields) {
        const split = fieldAndType.split(".", 2);
        const type = split[0];
        const field = split[1];

        // This should only be __typename.
        if (type === "Permission") {
            if (field === "__typename") {
                continue;
            }
            throw new Error(`Unexpected field in permissionsFor custom rule: ${type}.${field}`);
        }

        if (type !== "GroupPermission" && type !== "UserPermission") {
            throw new Error("Unexpected type in permissionsFor custom rule: " + type);
        }
        selectedFields[type].push(field);

        // if(!req.permissions.can(AbilityAction.Read, type, field)) {
        //     logger.verbose(`Failed field-base permissionsFor rule test for field "${type}.${field}".`);
        //     req.passed = false;
        //     return of(null);
        // }
    }

    return handler().pipe(
        map((values) => {
            // Handler already marked the request as failed for some permission error.
            if (req.passed === false) {
                logger.verbose("Failed permissionsFor rule test. Handler already marked as failed.");
                return null;
            }

            // If the value is nullish, there's no value to check, so just return null.
            if (values === null || values === undefined) {
                req.passed = true;
                return null;
            }

            // Repeat previous tests with the values as the subject.

            for (const value of values) {
                const subjectStr = "userId" in value ? "UserPermission" : "GroupPermission";
                const subjectObj = subject(subjectStr, value);
                if (!req.permissions.can(AbilityAction.Read, subjectObj)) {
                    logger.verbose("Failed basic permissionsFor rule test on one or more values.");
                    req.passed = false;
                    return null;
                }

                // Test the ability against each requested field with subject value.
                for (const field of selectedFields[subjectStr]) {
                    if (!req.permissions.can(AbilityAction.Read, subjectObj, field)) {
                        // Strict mode will cause the entire request to fail if any field fails. Otherwise, the field
                        //  will be set to null. The user won't necessarily know (as of now) whether the field is
                        //  actually null, or they just can't read it.
                        if (rule.options?.strict ?? false) {
                            logger.verbose(
                                `Failed field-based permissionsFor rule test for field "${subjectStr}.${field}" on one or more values.`
                            );
                            req.passed = false;
                            return null;
                        } else {
                            logger.verbose(
                                `Failed field-based permissionsFor rule test for field "${subjectStr}.${field}" on one value. More may come...`
                            );
                            value[field] = null;
                        }
                    }
                }
            }

            req.passed = true;
            return values;
        })
    );
}
