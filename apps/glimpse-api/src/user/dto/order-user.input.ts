import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum UserOrderableFields {
    id = "id",
    mail = "mail",
    username = "username",
    joined = "joined"
}

registerEnumType(UserOrderableFields, {
    name: "UserOrderableFields"
});

/**
 * Input type for ordering Users in ReadMany queries.
 */
@InputType()
export class OrderUserInput {
    /**
     * Name of the field to sort by.
     */
    field: UserOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
