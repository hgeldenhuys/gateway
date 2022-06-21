import { MatchedEvent } from '../events'

export class MatchedCommand {
	constructor(public readonly event: MatchedEvent) {}
}
