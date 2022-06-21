import { InputChangedEvent } from '../events'

export class InputChangeCommand {
	constructor(public readonly inputChanged: InputChangedEvent, public readonly id: string) {}
}
