import { PrimaryKey } from './PrimaryKey'

/**
 * Tests for PrimaryKey
 */
describe('PrimaryKey', () => {
	class Test {
		@PrimaryKey
		attribute: string
	}

	it('should be defined', async () => {
		expect(PrimaryKey).toBeDefined()
	})

	it('should decorate class', async () => {
		const test = new Test()
		expect((test as any).__primaryKey).toBe('attribute')
	})
})
