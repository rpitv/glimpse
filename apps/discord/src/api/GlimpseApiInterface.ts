import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";

export interface GlimpseApiEvents {
    createProduction: (production: Production) => void;
    updateProduction: (production: Production) => void;
    deleteProduction: (production: Production) => void;
    updateUser: (user: User) => void;
    deleteUser: (user: User) => void;
}

export interface GlimpseApiInterface extends TypedEmitter<GlimpseApiEvents> {
    getUserFromUserId(userId: BigInt): Promise<ApiResponse<User | null>>;
    getUserFromDiscordId(discordUserId: string): Promise<ApiResponse<User | null>>;
    registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>>
    updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>>;
    setProductionDiscordData(productionId: BigInt, data: Record<string, any>): Promise<ApiResponse<void>>;
    getLatestProductions(): Promise<ApiResponse<Production[]>>;
    getProductionData(productionId: BigInt): Promise<ApiResponse<Production | null>>;
}
