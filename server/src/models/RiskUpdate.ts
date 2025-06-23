import { prisma } from '../db';

interface RiskUpdateData {
    locationName: string;
    lat: number;
    lon: number;
    disasterType: string;
    imageUrl: string;
    authorId: number;
}

export class RiskUpdateModel {
    static async create(data: RiskUpdateData) {
        return prisma.riskUpdate.create({
            data,
        });
    }
} 