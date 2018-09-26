import * as AWS from 'aws-sdk'
import * as util from 'util'
import * as I from '../Interfaces'
import { DynamoUtils } from '@/DynamoUtils'

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
	 * Create a simple/standard DynamoDB table
	 */
	async createTable(
		table: string,
		partitionKey: string,
		sortingKey?: string
	): Promise<boolean> {
		let d = this._dynamodb,
			ks = [],
			ad = []

		ks.push({ AttributeName: partitionKey, KeyType: 'HASH' })
		ad.push({ AttributeName: partitionKey, AttributeType: 'S' })

		if (sortingKey) {
			ks.push({ AttributeName: sortingKey, KeyType: 'RANGE' })
			ad.push({ AttributeName: sortingKey, AttributeType: 'S' })
		}

		return util
			.promisify(d.createTable.bind(d))({
				TableName: table,
				KeySchema: ks,
				AttributeDefinitions: ad,
				ProvisionedThroughput: {
					ReadCapacityUnits: 10,
					WriteCapacityUnits: 10
				}
			})
			.then(() => true)
			.catch(() => false)
	}

	/**
	 * Creates/updates an item in the dynamodb
	 */
	async put<T extends I.IModel>(item: T): Promise<T> {
		let c = this._docClient
		return util
			.promisify(c.put.bind(c))({
				TableName: DynamoUtils.getTableName(item),
				Item: DynamoUtils.classToDynamo(item)
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
				TableName: DynamoUtils.getTableName(cls),
				Key: DynamoUtils.getDynamoKey(cls, partitionKey, sortKey)
			})
			.then(({ Item }) => DynamoUtils.dynamoToClass(cls, Item))
			.catch(() => null)
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
				TableName: DynamoUtils.getTableName(cls)
			})
			.then(({ Items }) => ({
				items: (Items || []).map(Item => DynamoUtils.dynamoToClass(cls, Item))
			}))
	}

	/**
	 * Removes an item from the dynamodb datastore
	 */
	async remove<T extends I.IModel>(item: T): Promise<void> {
		let c = this._docClient
		return util.promisify(c.delete.bind(c))({
			TableName: DynamoUtils.getTableName(item),
			Key: DynamoUtils.getDynamoKey(item)
		})
	}
}
