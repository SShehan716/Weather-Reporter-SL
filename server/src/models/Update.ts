import { prisma } from '../db';

export class UpdateModel {
    /**
     * Fetches a paginated list of all updates (general and risk) for a specific user.
     */
    static async findAllByAuthorId(userId: number, page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        
        const updates = await prisma.$queryRaw`
            SELECT wu.id, wu."locationName", wu.temperature, wu.conditions, null as "disasterType", null as "imageUrl", wu."createdAt", 'general' as type, u.username as "authorName"
            FROM "WeatherUpdate" as wu
            JOIN "User" as u ON wu."authorId" = u.id
            WHERE wu."authorId" = ${userId}
            UNION ALL
            SELECT ru.id, ru."locationName", null as temperature, null as conditions, ru."disasterType", ru."imageUrl", ru."createdAt", 'risk' as type, u.username as "authorName"
            FROM "RiskUpdate" as ru
            JOIN "User" as u ON ru."authorId" = u.id
            WHERE ru."authorId" = ${userId}
            ORDER BY "createdAt" DESC
            LIMIT ${pageSize}
            OFFSET ${offset}
        `;

        const totalUpdatesResult = await prisma.$queryRaw<[{ count: BigInt }]>`
            SELECT SUM(total) as count FROM (
                SELECT COUNT(*) as total FROM "WeatherUpdate" WHERE "authorId" = ${userId}
                UNION ALL
                SELECT COUNT(*) as total FROM "RiskUpdate" WHERE "authorId" = ${userId}
            ) as "counts"
        `;
        
        const totalUpdates = Number(totalUpdatesResult[0].count);
        const totalPages = Math.ceil(totalUpdates / pageSize);

        return { updates, totalPages, currentPage: page };
    }

    /**
     * Fetches updates within a specific radius of a given coordinate.
     */
    static async findNearby(lat: number, lon: number, radius: number) {
        return prisma.$queryRaw`
            SELECT
              wu.id, wu."locationName", wu.temperature, wu.conditions, null as "disasterType", null as "imageUrl", wu."createdAt", 'general' as type, wu.lat, wu.lon, u.username as "authorName",
              (6371 * acos(cos(radians(${lat})) * cos(radians(wu.lat)) * cos(radians(wu.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(wu.lat)))) as distance
            FROM "WeatherUpdate" as wu JOIN "User" as u ON wu."authorId" = u.id
            WHERE (6371 * acos(cos(radians(${lat})) * cos(radians(wu.lat)) * cos(radians(wu.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(wu.lat)))) <= ${radius}
            UNION ALL
            SELECT
              ru.id, ru."locationName", null as temperature, null as conditions, ru."disasterType", ru."imageUrl", ru."createdAt", 'risk' as type, ru.lat, ru.lon, u.username as "authorName",
              (6371 * acos(cos(radians(${lat})) * cos(radians(ru.lat)) * cos(radians(ru.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(ru.lat)))) as distance
            FROM "RiskUpdate" as ru JOIN "User" as u ON ru."authorId" = u.id
            WHERE (6371 * acos(cos(radians(${lat})) * cos(radians(ru.lat)) * cos(radians(ru.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(ru.lat)))) <= ${radius}
            ORDER BY distance ASC, "createdAt" DESC
            LIMIT 20
        `;
    }

    /**
     * Fetches all updates within a given country.
     */
    static async findAllByCountry(country: string) {
        return prisma.$queryRaw`
            SELECT
              wu.id, wu."locationName", wu.temperature, wu.conditions, null as "disasterType", null as "imageUrl", wu."createdAt", 'general' as type, wu.lat, wu.lon, u.username as "authorName", null as distance
            FROM "WeatherUpdate" as wu JOIN "User" as u ON wu."authorId" = u.id
            WHERE wu."locationName" ILIKE ${'%' + country + '%'}
            UNION ALL
            SELECT
              ru.id, ru."locationName", null as temperature, null as conditions, ru."disasterType", ru."imageUrl", ru."createdAt", 'risk' as type, ru.lat, ru.lon, u.username as "authorName", null as distance
            FROM "RiskUpdate" as ru JOIN "User" as u ON ru."authorId" = u.id
            WHERE ru."locationName" ILIKE ${'%' + country + '%'}
            ORDER BY "createdAt" DESC
            LIMIT 20
        `;
    }
} 