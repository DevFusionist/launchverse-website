export type ActivityAction =
  | 'CREATE_STUDENT'
  | 'UPDATE_STUDENT'
  | 'DELETE_STUDENT'
  | 'CREATE_COURSE'
  | 'UPDATE_COURSE'
  | 'DELETE_COURSE'
  | 'CREATE_CERTIFICATE'
  | 'UPDATE_CERTIFICATE'
  | 'DELETE_CERTIFICATE'
  | 'BULK_REVOKE_CERTIFICATES'
  | 'CREATE_COMPANY'
  | 'UPDATE_COMPANY'
  | 'DELETE_COMPANY'
  | 'CREATE_PLACEMENT'
  | 'UPDATE_PLACEMENT'
  | 'DELETE_PLACEMENT';

export type EntityType =
  | 'student'
  | 'course'
  | 'certificate'
  | 'company'
  | 'placement';

export interface ActivityLogDetails {
  studentName?: string;
  courseTitle?: string;
  certificateCode?: string;
  companyName?: string;
  position?: string;
  status?: string;
  count?: number;
  message?: string;
  [key: string]: any;
}

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  entity: EntityType;
  entityId: string;
  details: ActivityLogDetails;
  adminId: string;
  admin: {
    id: string;
    name: string;
  };
  createdAt: Date;
}
