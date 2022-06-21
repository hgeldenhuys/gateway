export class ConnectedCommand {
	constructor(public readonly event: { id: string; as: 'client' | 'server' }) {}
}
