import { Model } from "./Model"
import { PrimaryKey } from "./PrimaryKey"
import { SecondaryKey } from "./SecondaryKey"

/**
 * Tests for Model
 */
describe('Model', () => {

	@Model({
		title: 'Title',
		description: 'Description',
		kind: 'Kind'
	})
	class Test {
		@PrimaryKey
		attribute: string

		@SecondaryKey
		attribute2: string
	}

	@Model()
	class Test2 {}

	it('should be defined', async () => {
		expect(PrimaryKey).toBeDefined()
	})

	it('should decorate class', async () => {
		const test = new Test()
		expect((test as any).meta).toBeDefined
	})

})