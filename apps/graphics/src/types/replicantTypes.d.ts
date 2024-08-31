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
            people: string[];
            peopleColor: string;
            peopleSize: number;
            title: string;
            titleColor: string;
            titleSize: number;
        }[]
        show: boolean
    }
}

export type LowerThird = {
    bug: {
        show: boolean
        offsetX: number
        offsetY: number
    }
    commentators: {
        leftPerson: CommentatorPerson
        centerPerson: CommentatorPerson
        rightPerson: CommentatorPerson
        offsetY: number
        show: boolean
    }
    copyright: {
        show: boolean
        offsetX: number
        offsetY: number
        text: string
        textColor: string
        textSize: number
    }
    locator: {
        leftTeam: LocatorTeam
        rightTeam: LocatorTeam
        location: {
            name: string
            nameColor: string
            nameSize: number
        }
        show: boolean
    }
    scoreboard: {
        description: {
            fontSize: number
            fontColor: string
            text: string
            timer: boolean
        }
        leftTeam: LowerThirdScoreboardTeam
        rightTeam: LowerThirdScoreboardTeam
        show: boolean
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
    name: string
    nameColor: string
    nameSize: number
    description: string
    descriptionColor: string
    descriptionSize: number
}

type LocatorTeam = {
    name: string
    nameColor: string
    nameSize: number
    logo: string
    logoSize: number
    primaryColor: string
    secondaryColor: string
}

type LowerThirdScoreboardTeam = {
    name: string
    nameColor: string
    nameSize: number
    logo: string
    logoSize: number
    primaryColor: string
    score: number
    scoreColor: string
    scoreSize: number
    secondaryColor: string
}