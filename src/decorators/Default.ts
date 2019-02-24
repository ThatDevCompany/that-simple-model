import { Transform } from 'class-transformer'

/**
 * DECORATOR
 * The @Default decorator
 */
export function Default(defaultValue: any) {
	return Transform((value: any) => value || defaultValue)
}
