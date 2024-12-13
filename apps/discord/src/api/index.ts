import {ApiResponse} from "./ApiResponse";
import {TypedEmitter} from "./TypedEmitter";

interface Production {}

interface User {}

interface ApiEvents {
    createProduction: (production: Production) => void;
    updateProduction: (production: Production) => void;
    deleteProduction: (production: Production) => void;
}

export interface GlimpseApiInterface extends TypedEmitter<ApiEvents> {
    getUser(discordUserId: string): Promise<ApiResponse<User | null>>;
    registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>>
    updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>>;
    setProductionMessageId(productionId: BigInt, messageId: BigInt): Promise<ApiResponse<void>>;
    getLatestProductions(): Promise<ApiResponse<Production[]>>;
    getProductionData(productionId: BigInt): Promise<ApiResponse<Production | null>>;
}

export class GlimpseApi extends TypedEmitter<ApiEvents> implements GlimpseApiInterface {
    public getUser(discordUserId: string): Promise<ApiResponse<User | null>> {
        throw new Error("Not implemented");
    }

    public registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>> {
        throw new Error("Not implemented");
    }

    public updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public setProductionMessageId(productionId: BigInt, messageId: BigInt): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        throw new Error("Not implemented");
    }

    public getProductionData(productionId: BigInt): Promise<ApiResponse<Production | null>> {
        throw new Error("Not implemented");
    }
}

export class DummyGlimpseApi extends TypedEmitter<ApiEvents> implements GlimpseApiInterface {
    public getUser(discordUserId: string): Promise<ApiResponse<User | null>> {
        throw new Error("Not implemented");
    }

    public registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>> {
        throw new Error("Not implemented");
    }

    public updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public setProductionMessageId(productionId: BigInt, messageId: BigInt): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        throw new Error("Not implemented");
    }

    public getProductionData(productionId: BigInt): Promise<ApiResponse<Production | null>> {
        throw new Error("Not implemented");
    }
}

export { ApiResponse };
