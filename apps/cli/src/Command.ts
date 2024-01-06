export enum CommandMode {
    Interactive,
    Direct
}

export type CommandContext = {
    commands: Command[],
    mode: CommandMode
}

export abstract class Command {

    public abstract run(ctx: CommandContext, args: string[]): Promise<void>;

    public abstract getDescription(): string;

    public abstract getUsage(): string;

    public abstract getName(): string;

    public abstract getAliases(): string[];
}
