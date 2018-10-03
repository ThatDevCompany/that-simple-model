/**
 * DECORATOR
 * The @SecondaryKey decorator
 */
export function SecondaryKey(target: any, key: string) {
	target['__secondaryKey'] = key
}
