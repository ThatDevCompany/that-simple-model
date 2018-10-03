/**
 * An interface for an object which contains a collection of properties describing a model
 */
export interface IMetaModel {
	/**
	 * The title of the Model
	 */
	title: string

	/**
	 * A description of the Model
	 */
	description: string

	/**
	 * The kind for the Model (often this reflects the TableName for object persistence
	 */
	kind: string

	/**
	 * The attribute name for the primary key of the Model
	 */
	primaryKey: string

	/**
	 * The attribute name for the secondary key of the Model
	 */
	secondaryKey: string
}
