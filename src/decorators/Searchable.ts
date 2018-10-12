/**
 * DECORATOR
 * The @Searchable decorator
 */
export function Searchable(target: any, key: string) {
	if (!target['__searchables']) {
		target['__searchables'] = []
	}
	target['__searchables'].push(key)
}
