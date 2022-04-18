/*
We can use a 'Brand' type to provide nominal typing for types that are otherwise structurally compatible.
*/

declare const brand: unique symbol;

export type Brand<T> = { readonly [brand]: T };
