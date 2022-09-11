export function nonNullAssert<T>(a: T | undefined | null): T {
	return a!;
}
