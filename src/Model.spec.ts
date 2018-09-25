import { MultiKey } from './testing'

/**
 * Tests for Model decorators
 */

describe('Model decorators', () => {
	/* should attach a meta description to the class */
	it('should attach a meta description to the class', async () => {
		expect(MultiKey.meta.name).toBe('MultiKey')
		expect(MultiKey.meta.table).toBe('MultiKey')
		expect(MultiKey.meta.description).toBe('Description')
		expect(MultiKey.meta.partitionKey).toBe('hash')
		expect(MultiKey.meta.sortingKey).toBe('range')
	})
})
