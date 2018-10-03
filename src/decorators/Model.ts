import { IMetaModel } from '@/IMetaModel'

/**
 * DECORATOR
 * The @Model decorator
 *
 * This basically sets up the CLASS.meta object with information
 * describing the model
 *
 * e.g.
 * @Model({
 *     description: '...',
 *     kind: '...'
 * })
 * class MyModel implements IModel {
 * 		meta: IMetaModel
 * 		static meta: IMetaModel
 * }
 */
export function Model(
	def: { title?: string; description?: string; kind?: string } = {}
) {
	return function ModelDecorator(target: any) {
		const meta: IMetaModel = {
			title: def.title || target.name,
			description: def.description || '',
			kind: def.kind || target.name,
			primaryKey: target.prototype.__primaryKey,
			secondaryKey: target.prototype.__secondaryKey || null
		}
		target['meta'] = target.prototype.meta = meta
		delete target.prototype.__primaryKey
		delete target.prototype.__secondaryKey
	}
}
