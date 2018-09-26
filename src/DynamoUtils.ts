import { classToPlain, plainToClass } from 'class-transformer'
import * as _ from 'lodash'
import * as I from '@/Interfaces'
import { MetaModel } from '@/Model'

/**
 * A collection of Dynamo utility functions
 */
export const DynamoUtils = {
	/**
	 * Returns an Dynamo Table name for a given Model object or class
	 */
	getTableName<T extends I.IModel>(itemOrClass: T | I.IModelClass<T>): any {
		let meta: MetaModel =
			typeof itemOrClass === 'object'
				? (itemOrClass as I.IModel).meta
				: (itemOrClass as I.IModelClass<T>).meta
		return meta.table
	},

	/**
	 * Returns an Dynamo Key object for a given Model object or class
	 */
	getDynamoKey<T extends I.IModel>(
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
	},

	/**
	 * Returns a Model from a given dynamo object
	 */
	dynamoToClass<T extends I.IModel>(cls: I.IModelClass<T>, dynamoItem: any): T {
		if (!dynamoItem) {
			return null
		}
		const retVal: object = {
			[cls.meta.partitionKey]: dynamoItem[cls.meta.partitionKey],
			...this.decodeDynamoInfo(dynamoItem.info)
		}
		if (cls.meta.sortingKey) {
			retVal[cls.meta.sortingKey] = dynamoItem[cls.meta.sortingKey]
		}
		return plainToClass(cls, retVal)
	},

	/**
	 * Returns a Dynamo object from a given Model item
	 */
	classToDynamo<T extends I.IModel>(item: T): any {
		const retVal: object = {
			[item.meta.partitionKey]: item[item.meta.partitionKey],
			info: this.encodeDynamoInfo(classToPlain(item))
		}
		if (item.meta.sortingKey) {
			retVal[item.meta.sortingKey] = item[item.meta.sortingKey]
		}
		return retVal
	},

	/**
	 * Encodes an object so it can be persisted into dynamo
	 */
	encodeDynamoInfo(info: any): any {
		return _.cloneDeepWith(info, value => {
			// Replace EMPTY strings
			if (value === '') {
				return 'EMPTY'
			}
			// Replace NULL strings
			if (value === null) {
				return 'NULL'
			}
		})
	},

	/**
	 * Decodes an object that has been persisted in dynamo
	 */
	decodeDynamoInfo(info: any): any {
		return _.cloneDeepWith(info, value => {
			// Replace EMPTY strings
			if (value === 'EMPTY') {
				return ''
			}
			// Replace NULL strings
			if (value === 'NULL') {
				return null
			}
		})
	}
}
