import { IMetaModel } from './IMetaModel'
import { IModel } from './IModel'

/**
 * Simple reflexive interface for an IModel class
 */
export interface IModelClass<T extends IModel> {
	new (...args): T
	meta: IMetaModel
}
