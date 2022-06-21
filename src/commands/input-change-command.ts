import { InputChangedEvent } from '../events'

export class InputChangeCommand {
	constructor(public readonly inputChanged: InputChangedEvent) {}
}
