import { SecondaryKey } from './SecondaryKey'

/**
 * Tests for SecondaryKey
 */
describe('SecondaryKey', () => {
	class Test {
		@SecondaryKey
		attribute: string
	}

	it('should be defined', async () => {
		expect(SecondaryKey).toBeDefined()
	})

	it('should decorate class', async () => {
		const test = new Test()
		expect((test as any).__secondaryKey).toBe('attribute')
	})
})
