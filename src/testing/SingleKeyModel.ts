import { Model, PrimaryKey, IModel, IMetaModel } from '@/index'

/**
 * An example of a SingleKey model
 */
@Model({
	description: 'Description',
	kind: 'SingleKey',
	indexes: [{ primaryKey: 'hash', secondaryKey: 'title' }]
})
export class SingleKey implements IModel {
	static meta: IMetaModel
	meta: IMetaModel

	@PrimaryKey
	hash: string

	title: string
}
