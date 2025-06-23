import { prisma } from '../db';

interface WeatherUpdateData {
    locationName: string;
    lat: number;
    lon: number;
    temperature: number;
    conditions: string;
    authorId: number;
}

export class WeatherUpdateModel {
    static async create(data: WeatherUpdateData) {
        return prisma.weatherUpdate.create({
            data,
        });
    }
} 