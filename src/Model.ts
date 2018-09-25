/**
 * A collection of properties describing a metamodel
 */
export class MetaModel {
	name: string
	description: string
	table: string
	partitionKey: string
	sortingKey: string
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
 *     table: '...'
 * })
 * class MyModel {
 * }
 */
export function Model(model: { description: string; table: string }) {
	return function ModelDecorator(target: any) {
		const meta: MetaModel = new MetaModel()
		meta.name = target.name
		meta.description = model.description
		meta.table = model.table
		meta.partitionKey = target.prototype.__partitionKey
		meta.sortingKey = target.prototype.__sortingKey || null
		target['meta'] = target.prototype.meta = meta
		delete target.prototype.__partitionKey
		delete target.prototype.__sortingKey
	}
}

/**
 * DECORATOR
 * The @PartitionKey decorator
 */
export function PartitionKey(target: any, key: string) {
	target['__partitionKey'] = key
}

/**
 * DECORATOR
 * The @SortingKey decorator
 */
export function SortingKey(target: any, key: string) {
	target['__sortingKey'] = key
}
