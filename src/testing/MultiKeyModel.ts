import { Model, PartitionKey, SortingKey, MetaModel } from '../Model'
import { IModel } from '../Interfaces'

/**
 * Example of a MultiKey model
 */
@Model({
	description: 'Description',
	table: 'MultiKey'
})
export class MultiKey implements IModel {
	static meta: MetaModel
	meta: MetaModel

	@PartitionKey
	hash: string

	@SortingKey
	range: string

	title: string
}
