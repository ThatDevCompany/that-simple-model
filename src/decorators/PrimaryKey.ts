/**
 * DECORATOR
 * The @PrimaryKey decorator
 */
export function PrimaryKey(target: any, key: string) {
	console.log(target)
	target['__primaryKey'] = key
}
