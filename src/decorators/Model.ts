import { IMetaModel } from '@/IMetaModel'

/**
 * Interface for a model definition object
 */
export interface IModelDef {
	title?: string
	description?: string
	kind?: string
}

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
export function Model(def: IModelDef = {}) {
	return function ModelDecorator(target: any) {
		const meta: IMetaModel = {
			title: def.title || target.name,
			description: def.description || '',
			kind: def.kind || target.name,
			primaryKey: target.prototype.__primaryKey,
			secondaryKey: target.prototype.__secondaryKey || null,
			searchables: target.prototype.__searchables || []
		}
		target['meta'] = target.prototype.meta = meta
		delete target.prototype.__primaryKey
		delete target.prototype.__secondaryKey
		delete target.prototype.__searchables
	}
}
