export class StandingsTeam {
    public position: number;
    public teamColor: string;
    public logoLink: string;
    public teamName: string;
    public record: string;

    public constructor() {
        this.position = 0;
        this.teamColor = "";
        this.logoLink = "";
        this.teamName = "";
        this.record = "";
    }
}
