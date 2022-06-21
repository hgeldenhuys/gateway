export class DisconnectedCommand {
	constructor(public readonly event: { id: string; as: 'client' | 'server' }) {}
}
