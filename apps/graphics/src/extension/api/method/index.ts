import {Request, Response} from "express"
import {handleToggle} from "./toggle";
import {handleDocs} from "./docs";
import {handleAnnouncements} from "./announcements";
import {handleScore} from "./score";
import {handleFootball} from "@nodecg-vue-ts-template/api/method/football";

export const methods: { [key: string]: (req: Request, res: Response, endpoint: string) => void } = {
	"docs": handleDocs,
	"toggle": handleToggle,
	"announcements": handleAnnouncements,
	"score": handleScore,
	"football": handleFootball,
}
