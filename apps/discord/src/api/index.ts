import {ApiResponse} from "./ApiResponse";
import {TypedEmitter} from "./TypedEmitter";

interface Production {}

interface ApiEvents {
    createProduction: (production: Production) => void;
    updateProduction: (production: Production) => void;
    deleteProduction: (production: Production) => void;
}

export interface GlimpseApiInterface extends TypedEmitter<ApiEvents> {
    getRegistrationLink(discordUserId: string): Promise<ApiResponse<{ link: string }>>;
    getLatestProductions(): Promise<ApiResponse<Production[]>>;
    getProductionData(productionId: BigInt): Promise<ApiResponse<Production>>;
    updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>>;
}

export class GlimpseApi extends TypedEmitter<ApiEvents> implements GlimpseApiInterface {
    public getRegistrationLink(discordUserId: string): Promise<ApiResponse<{ link: string }>> {
        throw new Error("Not implemented");
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        throw new Error("Not implemented");
    }

    public getProductionData(productionId: BigInt): Promise<ApiResponse<Production>> {
        throw new Error("Not implemented");
    }

    public updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }
}

export class DummyGlimpseApi extends TypedEmitter<ApiEvents> implements GlimpseApiInterface {
    public getRegistrationLink(discordUserId: string): Promise<ApiResponse<{ link: string }>> {
        throw new Error("Not implemented");
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        throw new Error("Not implemented");
    }

    public getProductionData(productionId: BigInt): Promise<ApiResponse<Production>> {
        throw new Error("Not implemented");
    }

    public updateUserVolunteerStatus(discordUserId: string, status: boolean): Promise<ApiResponse<void>> {
        throw new Error("Not implemented");
    }
}

export { ApiResponse };
