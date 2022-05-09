import { Request } from "express";

export class GlimpseRequest extends Request {
    session?: { admin: boolean, rcs_id: string }
}
