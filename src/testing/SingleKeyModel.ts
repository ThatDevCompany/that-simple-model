import { Model, PartitionKey, MetaModel } from '../Model'
import { IModel } from '../Interfaces'

/**
 * An example of a SingleKey model
 */
@Model({
	description: 'Description',
	table: 'SingleKey'
})
export class SingleKey implements IModel {
	static meta: MetaModel
	meta: MetaModel

	@PartitionKey
	hash: string

	title: string
}
