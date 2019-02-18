/**
 * DECORATOR
 * The @PrimaryKey decorator
 */
export function PrimaryKey(target: any, key: string) {
	target['__primaryKey'] = key
}
