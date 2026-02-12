import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => resolve(reader.result as string);

		reader.onerror = reject;

		reader.readAsDataURL(file);
	});
}

export function useZodQuery<
	TQueryFnData,
	TParsed = TQueryFnData,
	TError = unknown,
	TQueryKey extends readonly unknown[] = readonly unknown[],
>(
	// The Zod schema for *raw* data (before parse)
	schema: z.ZodType<TQueryFnData>,
	queryKey: TQueryKey,
	queryFn: () => Promise<TQueryFnData>,
	options?: Omit<
		UseQueryOptions<TQueryFnData, TError, TParsed, TQueryKey>,
		"select"
	>,
): UseQueryResult<TParsed, TError> {
	return useQuery<TQueryFnData, TError, TParsed, TQueryKey>({
		queryKey,
		queryFn,
		...options,
		select: (data) => {
			const parsed = schema.safeParse(data);
			if (!parsed.success) {
				console.error("Zod validation failed:", parsed.error);
				throw parsed.error;
			}
			return parsed.data as unknown as TParsed;
		},
	});
}

export type OperationSuccess<T> = { readonly data: T; readonly error: null };
export type OperationFailure<E> = { readonly data: null; readonly error: E };
export type OperationResult<T, E> = OperationSuccess<T> | OperationFailure<E>;

type Operation<T> = Promise<T> | (() => T) | (() => Promise<T>);

export function attempt<T, E = Error>(
	operation: Promise<T>,
): Promise<OperationResult<T, E>>;
export function attempt<E = Error>(
	operation: () => never,
): OperationResult<never, E>;
export function attempt<T, E = Error>(
	operation: () => Promise<T>,
): Promise<OperationResult<T, E>>;
export function attempt<T, E = Error>(
	operation: () => T,
): OperationResult<T, E>;
export function attempt<T, E = Error>(
	operation: Operation<T>,
): OperationResult<T, E> | Promise<OperationResult<T, E>> {
	try {
		const result = typeof operation === "function" ? operation() : operation;

		if (isPromise(result)) {
			return Promise.resolve(result)
				.then((data) => onSuccess(data))
				.catch((error) => onFailure(error));
		}

		return onSuccess(result);
	} catch (error) {
		return onFailure<E>(error);
	}
}

const onSuccess = <T>(value: T): OperationSuccess<T> => {
	return { data: value, error: null };
};

const onFailure = <E>(error: unknown): OperationFailure<E> => {
	const errorParsed = error instanceof Error ? error : new Error(String(error));
	return { data: null, error: errorParsed as E };
};

const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
	return (
		!!value &&
		(typeof value === "object" || typeof value === "function") &&
		typeof (value as Promise<T>).then === "function"
	);
};
