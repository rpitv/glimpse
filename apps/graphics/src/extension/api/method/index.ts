import {Request, Response} from "express"
import {handleToggle} from "./toggle";
import {handleDocs} from "./docs";
import {handleAnnouncements} from "./announcements";
import {handleScore} from "./score";

export const methods: { [key: string]: (req: Request, res: Response, endpoint: string) => void } = {
	"docs": handleDocs,
	"toggle": handleToggle,
	"announcements": handleAnnouncements,
	"score": handleScore,
}
