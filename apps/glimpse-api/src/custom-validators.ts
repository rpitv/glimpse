import {buildMessage, ValidateBy, ValidationOptions} from "class-validator";

/* Source: https://github.com/typestack/class-validator/blob/ca92d5719feeb595901042043b6488a038ae1a14/src/decorator/number/Min.ts

The MIT License

Copyright (c) 2015-2020 TypeStack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */

/**
 * Checks if the first number is a BigInt and greater than or equal to the second.
 */
export function bigIntMin(num: unknown, min: bigint): boolean {
    return typeof num === "bigint" && typeof min === "bigint" && num >= min;
}

/**
 * Checks if the value is a BigInt and is greater than or equal to the allowed minimum value.
 */
export function BigIntMin(minValue: number, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: "bigIntMin",
            constraints: [minValue],
            validator: {
                validate: (value, args): boolean => bigIntMin(value, args?.constraints[0]),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a BigInt and not be less than $constraint1",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
