import { insertActivity, getRecentActivity } from '../database/queries/activity.js';

const SENSITIVE_KEYS = new Set([
  'password', 'password_hash', 'mfaSecret', 'mfa_secret', 'token', 'sessionToken', 'recoveryCode', 'recoveryCodes'
]);

export class ActivityService {
  static async logActivity(
    userId: string,
    actionType: string,
    entityType: string | null = null,
    entityId: string | null = null,
    metadata: Record<string, any> | null = null
  ): Promise<void> {
    try {
      let safeMetadataStr: string | null = null;
      if (metadata) {
        const safeMetadata: Record<string, any> = {};
        for (const [key, value] of Object.entries(metadata)) {
          if (!SENSITIVE_KEYS.has(key)) {
            safeMetadata[key] = value;
          }
        }
        safeMetadataStr = JSON.stringify(safeMetadata);
      }
      
      await insertActivity(userId, actionType, entityType, entityId, safeMetadataStr);
    } catch (error) {
      console.error('Failed to log activity:', error);
      // We generally do not want to throw and fail the main request just because logging failed.
    }
  }

  static async getRecentActivity(userId: string, limit: number = 20) {
    const rawActivities = await getRecentActivity(userId, limit);
    return rawActivities.map(activity => ({
      ...activity,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null
    }));
  }
}

