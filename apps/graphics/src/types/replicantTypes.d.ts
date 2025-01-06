import type { Ref } from "vue";

export type Sync = {
    availablePorts: string[]
    selectedPort: string | null
    selectedSport: string
    status: Status
    values: {
        clock: boolean
        period: boolean
        teams: {
            score: boolean
            name: boolean
            abbreviation: boolean
            shots: boolean
            timeouts: boolean
        }[]
        baseball: {
            bottomTop: boolean
            outsStrikesBalls: boolean
        }
        football: {
            downs: boolean
            possession: boolean
            yardsToGo: boolean
            playClock: boolean
        }
        sogs: boolean
        faceoffs: boolean
    }
}

type Status = {
    connected: boolean,
    bitrate: number
    error: boolean
    errorMsg: string
}

export type GameSettings = {
    api: {
        enabled: boolean
        key: string
        forceReload: boolean
    }
    style: "espn" | "rpitv" | "football"
    clock: {
        enabled: boolean
    }
    periods: {
        enabled: boolean
        count: number
        length: number
        overtime: {
            count: number
            isInfinite: boolean
            length: number
        }
        shootouts: boolean
    }
    showShootouts: boolean
    baseball: {
        bases: boolean
        bottomTop
        outsStrikesBalls: boolean
    },
    football: {
        downs: boolean
        possession: boolean
        yardsToGo: boolean
        playClock: boolean
    }
}

export type Scoreboard = {
    visible: boolean
    clock: {
        time: number
        isRunning: boolean
    }
    period: number
    playClock: number
    down: number
    yardsToGo: string
    possession: string
    penalty: boolean
}

export type Team = {
    enabled: boolean
    score: number
    name: string
    abbreviation: string
    primaryColor: string
    secondaryColor: string
    scoreboardPrimaryColor: string
    scoreboardSecondaryColor: string
    logo: string
    schoolName: string
    shots: number
    player1PenaltyNumber: string
    player1PenaltyClock: string
    player2PenaltyNumber: string
    player2PenaltyClock: string
    timeouts: number
    shootouts: string
}

export type Fullscreen = {
    credits: {
        credit: {
            people: Ref<string[]>;
            peopleColor: Ref<string>;
            peopleSize: Ref<number>;
            title: Ref<string>;
            titleColor: Ref<string>;
            titleSize: Ref<number>;
        }[]
        show: Ref<boolean>
    }
}

export type LowerThird = {
    bug: {
        show: Ref<boolean>
        offsetX:  Ref<number>
        offsetY: Ref<number>
    }
    commentators: {
        leftPerson: CommentatorPerson
        centerPerson: CommentatorPerson
        rightPerson: CommentatorPerson
        offsetY: Ref<number>
        show: Ref<boolean>
    }
    copyright: {
        show: Ref<boolean>
        offsetX: Ref<number>
        offsetY: Ref<number>
        text:  Ref<string>
        textColor: Ref<string>
        textSize: Ref<number>
    }
    locator: {
        leftTeam: LocatorTeam
        rightTeam: LocatorTeam
        location: {
            name: Ref<string>
            nameColor: Ref<string>
            nameSize: Ref<number>
        }
        show: Ref<boolean>
    }
    scoreboard: {
        description: {
            fontSize: Ref<number>
            fontColor: Ref<string>
            text: Ref<string>
            timer: Ref<boolean>
        }
        leftTeam: LowerThirdScoreboardTeam
        rightTeam: LowerThirdScoreboardTeam
        show: Ref<boolean>
    }
    endGraphics: any
    showProduced: any
}

export type Http = {
    sidearms: {
        url: string
        body: any
    }
}

type CommentatorPerson = {
    name: Ref<string>
    nameColor: Ref<string>
    nameSize: Ref<number>
    description: Ref<string>
    descriptionColor: Ref<string>
    descriptionSize: Ref<number>
}

type LocatorTeam = {
    name: Ref<string>
    nameColor: Ref<string>
    nameSize: Ref<number>
    logo: Ref<string>
    logoSize: Ref<number>
    primaryColor: Ref<string>
    secondaryColor: Ref<string>
}

type LowerThirdScoreboardTeam = {
    name: Ref<string>
    nameColor: Ref<string>
    nameSize: Ref<number>
    logo: Ref<string>
    logoSize: Ref<number>
    primaryColor: Ref<string>
    score: Ref<number>
    scoreColor: Ref<string>
    scoreSize: Ref<number>
    secondaryColor: Ref<string>
}