import { Pet, Tag, Scan } from '@/types';

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export function createAuditLog(
  action: string,
  entity: 'pet' | 'tag' | 'scan',
  entityId: string,
  userId: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return {
    id: crypto.randomUUID(),
    action,
    entity,
    entityId,
    userId,
    timestamp: new Date().toISOString(),
    metadata,
  };
}

export function logPetAction(
  action: string,
  pet: Pet,
  userId: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return createAuditLog(action, 'pet', pet.id, userId, {
    petName: pet.name,
    ...metadata,
  });
}

export function logTagAction(
  action: string,
  tag: Tag,
  userId: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return createAuditLog(action, 'tag', tag.id, userId, {
    tagNumber: tag.tag_number,
    ...metadata,
  });
}

export function logScanAction(
  action: string,
  scan: Scan,
  userId: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return createAuditLog(action, 'scan', scan.id, userId, {
    location: scan.location,
    ...metadata,
  });
} 