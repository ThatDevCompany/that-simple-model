import { MetaModel } from './model'

/**
 * Simple interface for a class with a model definition
 * property within it
 */
export interface IModel {
	meta: MetaModel
}

/**
 * Simple reflexive interface for an IModel class
 */
export interface IModelClass<T extends IModel> {
	new (...args): T
	meta: MetaModel
}

/**
 * An object type describing Query Options
 */
export interface IObjectStoreQueryOptions {
	where?: any
	sort?: any
}

/**
 * An object type describing Query Results
 */
export interface IObjectStoreQueryResult<T> {
	items: Array<T>
}

/**
 * Interface for an ObjectStore
 */
export interface IObjectStore {
	/**
	 * Add/update an item to the store
	 */
	put<T extends IModel>(item: T): Promise<T>

	/**
	 * Retrieve an item from the store
	 */
	get<T extends IModel>(
		cls: IModelClass<T>,
		partitionKey: string,
		sortKey?: string
	): Promise<T>

	/**
	 * Search the store for a collection of items
	 */
	query<T extends IModel>(
		cls: IModelClass<T>,
		queryOptions: IObjectStoreQueryOptions
	): Promise<IObjectStoreQueryResult<T>>

	/**
	 * Remove an item from the store
	 */
	remove<T extends IModel>(item: T): Promise<void>
}
