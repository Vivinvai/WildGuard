/**
 * Image Analysis Logging Service
 * 
 * Logs all image identification attempts for admin monitoring and analytics
 */

import { db } from "../db";
import { sql } from "drizzle-orm";

export interface ImageAnalysisLog {
  id: string;
  userId: string | null;
  userIpAddress: string | null;
  sessionId: string | null;
  imageUrl: string;
  imageSizeBytes: number | null;
  imageFormat: string | null;
  identifiedSpecies: string | null;
  scientificName: string | null;
  confidenceScore: number | null;
  conservationStatus: string | null;
  category: string | null;
  aiProvider: string;
  processingTimeMs: number | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  analysisType: string;
  isSuccessful: boolean;
  errorMessage: string | null;
  enhancedWithDatabase: boolean;
  databaseMatchFound: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  isFlagged: boolean;
  adminNotes: string | null;
  analyzedAt: Date;
  createdAt: Date;
}

export interface LogAnalysisParams {
  userId?: string | null;
  userIpAddress?: string | null;
  sessionId?: string | null;
  imageUrl: string;
  imageSizeBytes?: number | null;
  imageFormat?: string | null;
  identifiedSpecies?: string | null;
  scientificName?: string | null;
  confidenceScore?: number | null;
  conservationStatus?: string | null;
  category?: string | null;
  aiProvider: 'tensorflow' | 'gemini' | 'anthropic' | 'openai' | 'local' | 'hybrid';
  processingTimeMs?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  analysisType: 'animal' | 'flora' | 'wound' | 'threat';
  isSuccessful?: boolean;
  errorMessage?: string | null;
  enhancedWithDatabase?: boolean;
  databaseMatchFound?: boolean;
}

/**
 * Log an image analysis attempt
 */
export async function logImageAnalysis(params: LogAnalysisParams): Promise<string> {
  try {
    const result = await db.execute(sql`
      INSERT INTO image_analysis_log (
        user_id, user_ip_address, session_id, image_url, image_size_bytes, image_format,
        identified_species, scientific_name, confidence_score, conservation_status, category,
        ai_provider, processing_time_ms, latitude, longitude, location_name,
        analysis_type, is_successful, error_message, enhanced_with_database, database_match_found
      ) VALUES (
        ${params.userId || null},
        ${params.userIpAddress || null},
        ${params.sessionId || null},
        ${params.imageUrl},
        ${params.imageSizeBytes || null},
        ${params.imageFormat || null},
        ${params.identifiedSpecies || null},
        ${params.scientificName || null},
        ${params.confidenceScore || null},
        ${params.conservationStatus || null},
        ${params.category || null},
        ${params.aiProvider},
        ${params.processingTimeMs || null},
        ${params.latitude || null},
        ${params.longitude || null},
        ${params.locationName || null},
        ${params.analysisType},
        ${params.isSuccessful !== false},
        ${params.errorMessage || null},
        ${params.enhancedWithDatabase || false},
        ${params.databaseMatchFound || false}
      )
      RETURNING id
    `);
    
    return result.rows[0].id as string;
  } catch (error) {
    console.error("Error logging image analysis:", error);
    throw error;
  }
}

/**
 * Get all analysis logs with pagination
 */
export async function getAllAnalysisLogs(params: {
  limit?: number;
  offset?: number;
  analysisType?: string;
  aiProvider?: string;
  isSuccessful?: boolean;
  startDate?: Date;
  endDate?: Date;
}): Promise<ImageAnalysisLog[]> {
  try {
    let query = `SELECT * FROM image_analysis_log WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.analysisType) {
      query += ` AND analysis_type = $${paramIndex}`;
      queryParams.push(params.analysisType);
      paramIndex++;
    }

    if (params.aiProvider) {
      query += ` AND ai_provider = $${paramIndex}`;
      queryParams.push(params.aiProvider);
      paramIndex++;
    }

    if (params.isSuccessful !== undefined) {
      query += ` AND is_successful = $${paramIndex}`;
      queryParams.push(params.isSuccessful);
      paramIndex++;
    }

    if (params.startDate) {
      query += ` AND analyzed_at >= $${paramIndex}`;
      queryParams.push(params.startDate);
      paramIndex++;
    }

    if (params.endDate) {
      query += ` AND analyzed_at <= $${paramIndex}`;
      queryParams.push(params.endDate);
      paramIndex++;
    }

    query += ` ORDER BY analyzed_at DESC`;

    if (params.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
      paramIndex++;
    }

    if (params.offset) {
      query += ` OFFSET $${paramIndex}`;
      queryParams.push(params.offset);
    }

    // @ts-ignore - Drizzle execute accepts raw SQL
    const result = await db.execute(query, queryParams);
    return result.rows as unknown as ImageAnalysisLog[];
  } catch (error) {
    console.error("Error fetching analysis logs:", error);
    return [];
  }
}

/**
 * Get analysis statistics for admin dashboard
 */
export async function getAnalysisStatistics(params?: {
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  totalAnalyses: number;
  successfulAnalyses: number;
  failedAnalyses: number;
  byProvider: { [key: string]: number };
  byType: { [key: string]: number };
  bySpecies: { [key: string]: number };
  endangeredSpeciesCount: number;
  averageConfidence: number;
  totalUsers: number;
  recentAnalyses: ImageAnalysisLog[];
}> {
  try {
    let dateFilter = '';
    const queryParams: any[] = [];
    
    if (params?.startDate || params?.endDate) {
      dateFilter = ' WHERE ';
      const conditions: string[] = [];
      
      if (params.startDate) {
        conditions.push(`analyzed_at >= $1`);
        queryParams.push(params.startDate);
      }
      
      if (params.endDate) {
        const paramNum = queryParams.length + 1;
        conditions.push(`analyzed_at <= $${paramNum}`);
        queryParams.push(params.endDate);
      }
      
      dateFilter += conditions.join(' AND ');
    }

    // Total counts
    // @ts-ignore - Dynamic SQL query
    const totalResult = await db.execute({ 
      sql: `SELECT COUNT(*) as count FROM image_analysis_log${dateFilter}`,
      values: queryParams
    });
    
    // @ts-ignore - Dynamic SQL query
    const successResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} is_successful = true`,
      values: queryParams
    });
    
    // @ts-ignore - Dynamic SQL query
    const failedResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} is_successful = false`,
      values: queryParams
    });

    // By provider
    // @ts-ignore - Dynamic SQL query
    const providerResult = await db.execute({
      sql: `SELECT ai_provider, COUNT(*) as count FROM image_analysis_log${dateFilter} GROUP BY ai_provider`,
      values: queryParams
    });

    // By type
    // @ts-ignore - Dynamic SQL query
    const typeResult = await db.execute({
      sql: `SELECT analysis_type, COUNT(*) as count FROM image_analysis_log${dateFilter} GROUP BY analysis_type`,
      values: queryParams
    });

    // By species (top 10)
    // @ts-ignore - Dynamic SQL query
    const speciesResult = await db.execute({
      sql: `SELECT identified_species, COUNT(*) as count FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} identified_species IS NOT NULL GROUP BY identified_species ORDER BY count DESC LIMIT 10`,
      values: queryParams
    });

    // Endangered species
    // @ts-ignore - Dynamic SQL query
    const endangeredResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} conservation_status IN ('Endangered', 'Critically Endangered', 'Vulnerable')`,
      values: queryParams
    });

    // Average confidence
    // @ts-ignore - Dynamic SQL query
    const avgConfidenceResult = await db.execute({
      sql: `SELECT AVG(confidence_score) as avg FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} confidence_score IS NOT NULL`,
      values: queryParams
    });

    // Unique users
    // @ts-ignore - Dynamic SQL query
    const usersResult = await db.execute({
      sql: `SELECT COUNT(DISTINCT user_id) as count FROM image_analysis_log${dateFilter}${dateFilter ? ' AND' : ' WHERE'} user_id IS NOT NULL`,
      values: queryParams
    });

    // Recent analyses
    // @ts-ignore - Dynamic SQL query
    const recentResult = await db.execute({
      sql: `SELECT * FROM image_analysis_log${dateFilter} ORDER BY analyzed_at DESC LIMIT 10`,
      values: queryParams
    });

    const byProvider: { [key: string]: number } = {};
    for (const row of providerResult.rows) {
      byProvider[row.ai_provider as string] = Number(row.count);
    }

    const byType: { [key: string]: number } = {};
    for (const row of typeResult.rows) {
      byType[row.analysis_type as string] = Number(row.count);
    }

    const bySpecies: { [key: string]: number } = {};
    for (const row of speciesResult.rows) {
      bySpecies[row.identified_species as string] = Number(row.count);
    }

    return {
      totalAnalyses: Number(totalResult.rows[0]?.count || 0),
      successfulAnalyses: Number(successResult.rows[0]?.count || 0),
      failedAnalyses: Number(failedResult.rows[0]?.count || 0),
      byProvider,
      byType,
      bySpecies,
      endangeredSpeciesCount: Number(endangeredResult.rows[0]?.count || 0),
      averageConfidence: Number(avgConfidenceResult.rows[0]?.avg || 0),
      totalUsers: Number(usersResult.rows[0]?.count || 0),
      recentAnalyses: recentResult.rows as ImageAnalysisLog[]
    };
  } catch (error) {
    console.error("Error fetching analysis statistics:", error);
    return {
      totalAnalyses: 0,
      successfulAnalyses: 0,
      failedAnalyses: 0,
      byProvider: {},
      byType: {},
      bySpecies: {},
      endangeredSpeciesCount: 0,
      averageConfidence: 0,
      totalUsers: 0,
      recentAnalyses: []
    };
  }
}

/**
 * Flag/unflag an analysis for admin attention
 */
export async function flagAnalysis(
  analysisId: string,
  isFlagged: boolean,
  adminNotes?: string
): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE image_analysis_log
      SET is_flagged = ${isFlagged},
          admin_notes = ${adminNotes || null}
      WHERE id = ${analysisId}
    `);
    return true;
  } catch (error) {
    console.error("Error flagging analysis:", error);
    return false;
  }
}

/**
 * Verify an analysis
 */
export async function verifyAnalysis(
  analysisId: string,
  adminId: string
): Promise<boolean> {
  try {
    await db.execute(sql`
      UPDATE image_analysis_log
      SET verified_by = ${adminId},
          verified_at = NOW()
      WHERE id = ${analysisId}
    `);
    return true;
  } catch (error) {
    console.error("Error verifying analysis:", error);
    return false;
  }
}

/**
 * Get analyses by user
 */
export async function getAnalysesByUser(userId: string, limit: number = 50): Promise<ImageAnalysisLog[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM image_analysis_log
      WHERE user_id = ${userId}
      ORDER BY analyzed_at DESC
      LIMIT ${limit}
    `);
    return result.rows as ImageAnalysisLog[];
  } catch (error) {
    console.error("Error fetching user analyses:", error);
    return [];
  }
}

/**
 * Get flagged analyses
 */
export async function getFlaggedAnalyses(limit: number = 100): Promise<ImageAnalysisLog[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM image_analysis_log
      WHERE is_flagged = true
      ORDER BY analyzed_at DESC
      LIMIT ${limit}
    `);
    return result.rows as ImageAnalysisLog[];
  } catch (error) {
    console.error("Error fetching flagged analyses:", error);
    return [];
  }
}

/**
 * Delete old logs (data retention)
 */
export async function deleteOldLogs(olderThanDays: number = 365): Promise<number> {
  try {
    const result = await db.execute(sql`
      DELETE FROM image_analysis_log
      WHERE analyzed_at < NOW() - INTERVAL '${sql.raw(olderThanDays.toString())} days'
    `);
    return result.rowCount || 0;
  } catch (error) {
    console.error("Error deleting old logs:", error);
    return 0;
  }
}
