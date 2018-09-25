import * as sqlite from 'sqlite'
import { DynamoObjectStoreClass } from './DynamoObjectStore'
import { InitialiseDynamoDB, MultiKey, SingleKey } from '@/testing'

/**
 * Run and return a query on the db using SQLite
 * NOTE: We open and close it each time to avoid conflic ts between sqlite
 * and dynamo access
 */
async function dbGet(sql: string) {
	const db: sqlite.Database = await sqlite.open(
		`db/${process.env.AWS_ACCESS_KEY_ID}_${process.env.AWS_REGION}.db`
	)
	const result = await db.get(sql)
	db.close()
	return result
}

/**
 * Tests for Dynamo Objectstore
 */
describe('Dynamo ObjectStore', () => {
	let DynamoObjectStore
	let multiKey = new MultiKey()
	multiKey.hash = 'ABC'
	multiKey.range = '123'
	multiKey.title = 'Test Item'
	let singleKey = new SingleKey()
	singleKey.hash = 'ABC'
	singleKey.title = 'Test Item'

	// Setup the Test Database
	beforeAll(done => {
		InitialiseDynamoDB().then(() => {
			// Create ObjectStore
			DynamoObjectStore = new DynamoObjectStoreClass({
				region: process.env.AWS_REGION,
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				endpoint: process.env.AWS_ENDPOINT
			})
			done()
		})
	}, 20000)

	/* should allow PUTting of an item with MULTIple keys */
	it('should allow PUTting of an item with MULTIple keys', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.table}`)
		await DynamoObjectStore.put(multiKey)
		const data = await dbGet(
			`SELECT *
			FROM ${multiKey.meta.table}
			WHERE hashKey LIKE "${multiKey.hash}"
			AND rangeKey LIKE "${multiKey.range}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(multiKey.hash)
		expect(data.rangeKey.toString()).toBe(multiKey.range)
		expect(true).toBeTruthy()
	})

	/* should allow PUTting of an item with SINGLE keys */
	it('should allow PUTting of an item with SINGLE keys', async () => {
		await dbGet(`DELETE FROM ${SingleKey.meta.table}`)
		await DynamoObjectStore.put(singleKey)
		const data = await dbGet(
			`SELECT *
			FROM ${singleKey.meta.table}
			WHERE hashKey LIKE "${singleKey.hash}"`
		)
		expect(data).toBeDefined()
		expect(data.hashKey.toString()).toBe(singleKey.hash)
	})

	/* should allow GETting of an item with MULTIple keys by its ID */
	it('should allow GETting of an item with MULTIple keys by its ID', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.table}`)
		await DynamoObjectStore.put(multiKey)
		const data = await DynamoObjectStore.get(
			MultiKey,
			multiKey.hash,
			multiKey.range
		)
		expect(data instanceof MultiKey).toBeTruthy()
		expect((data as MultiKey).title).toBe(multiKey.title)
	})

	/* should allow GETting of an item with SINGLE keys by its ID */
	it('should allow GETting of an item with SINGLE keys by its ID', async () => {
		await dbGet(`DELETE FROM ${SingleKey.meta.table}`)
		await DynamoObjectStore.put(singleKey)
		const data = await DynamoObjectStore.get(SingleKey, singleKey.hash)
		expect(data instanceof SingleKey).toBeTruthy()
		expect((data as SingleKey).title).toBe(singleKey.title)
	})

	/* should allow simply QUERYing of all items */
	it('should allow simply QUERYing of all items', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.table}`)
		await DynamoObjectStore.put(multiKey)
		const data = await DynamoObjectStore.query(MultiKey)
		expect(data).toBeDefined()
		expect(data.items instanceof Array).toBeTruthy()
		expect(data.items.length).toBeGreaterThan(0)
	})

	/* should allow DELETEing of an item by its ID */
	it('should allow DELETEing of an item by its ID', async () => {
		await dbGet(`DELETE FROM ${MultiKey.meta.table}`)
		await DynamoObjectStore.put(multiKey)
		await DynamoObjectStore.remove(multiKey)
		const data = await dbGet(
			`SELECT *
			FROM ${multiKey.meta.table}
			WHERE hashKey LIKE "${multiKey.hash}"
			AND rangeKey LIKE "${multiKey.range}"`
		)
		expect(data).toBeUndefined()
	})
})
