import { classToPlain, plainToClass } from 'class-transformer'
import * as AWS from 'aws-sdk'
import * as util from 'util'
import { MetaModel } from '../model'
import * as I from '../Interfaces'

/**
 * ObjectStore for persisting to DynamoDB
 */
export class DynamoObjectStoreClass implements I.IObjectStore {
	/* PROPERTIES */
	/**
	 * The connection to the dynamodb service
	 */
	private _dynamodb: AWS.DynamoDB

	/**
	 * An instance of a document client
	 */
	private _docClient: AWS.DynamoDB.DocumentClient

	/* CONSTRUCTOR */
	constructor(config: AWS.DynamoDB.ClientConfiguration) {
		AWS.config.update(config)
		this._dynamodb = new AWS.DynamoDB()
		this._docClient = new AWS.DynamoDB.DocumentClient()
	}

	/* METHODS */
	/**
	 * Creates/updates an item in the dynamodb
	 */
	async put<T extends I.IModel>(item: T): Promise<T> {
		let c = this._docClient
		return util
			.promisify(c.put.bind(c))({
				TableName: this._getDynamoTableName(item),
				Item: {
					...this._getDynamoKey(item),
					info: classToPlain<T>(item)
				}
			})
			.then(() => item)
	}

	/**
	 * Returns an items from the dynamodb datastore
	 */
	async get<T extends I.IModel>(
		cls: I.IModelClass<T>,
		partitionKey: string | number,
		sortKey?: string | number
	): Promise<T> {
		let c = this._docClient
		return util
			.promisify(c.get.bind(c))({
				TableName: this._getDynamoTableName(cls),
				Key: this._getDynamoKey(cls, partitionKey, sortKey)
			})
			.then(({ Item }) => plainToClass(cls, Item.info))
	}

	/**
	 * Removes an item from the dynamodb datastore
	 */
	async query<T extends I.IModel>(
		cls: I.IModelClass<T>,
		queryOptions?: I.IObjectStoreQueryOptions
	): Promise<I.IObjectStoreQueryResult<T>> {
		let c = this._docClient
		return util
			.promisify(c.scan.bind(c))({
				TableName: this._getDynamoTableName(cls)
			})
			.then(({ Items }) => ({
				items: /* istanbul ignore next */ (Items || []).map(({ info }) =>
					plainToClass(cls, /* istanbul ignore next */ info || {})
				)
			}))
	}

	/**
	 * Removes an item from the dynamodb datastore
	 */
	async remove<T extends I.IModel>(item: T): Promise<void> {
		let c = this._docClient
		return util.promisify(c.delete.bind(c))({
			TableName: this._getDynamoTableName(item),
			Key: this._getDynamoKey(item)
		})
	}

	/**
	 * PRIVATE
	 * Returns an Dynamo TableName object for a given item or class
	 */
	private _getDynamoTableName<T extends I.IModel>(
		itemOrClass: T | I.IModelClass<T>
	): any {
		let meta: MetaModel =
			typeof itemOrClass === 'object'
				? (itemOrClass as I.IModel).meta
				: (itemOrClass as I.IModelClass<T>).meta
		return meta.table
	}

	/**
	 * PRIVATE
	 * Returns an Dynamo Key object for a given item
	 */
	private _getDynamoKey<T extends I.IModel>(
		itemOrClass: T | I.IModelClass<T>,
		partitionKey?: string | number,
		sortingKey?: string | number
	): any {
		const isItem = typeof itemOrClass === 'object'
		const meta: MetaModel = isItem
			? (itemOrClass as I.IModel).meta
			: (itemOrClass as I.IModelClass<T>).meta

		const key = {
			[meta.partitionKey]: isItem
				? (itemOrClass as I.IModel)[meta.partitionKey]
				: partitionKey
		}
		if (meta.sortingKey) {
			key[meta.sortingKey] = isItem
				? (itemOrClass as I.IModel)[meta.sortingKey]
				: sortingKey
		}
		return key
	}
}
