import { prisma } from './prisma';

// System admin ID for automated activities
const SYSTEM_ADMIN_ID = 'system_admin';

// Ensure system admin exists
async function ensureSystemAdmin() {
  try {
    const systemAdmin = await prisma.admin.findUnique({
      where: { id: SYSTEM_ADMIN_ID },
    });

    if (!systemAdmin) {
      await prisma.admin.create({
        data: {
          id: SYSTEM_ADMIN_ID,
          name: 'System',
          email: 'system@launchverse.com',
          password: 'system', // This password is never used for login
          role: 'ADMIN',
        },
      });
    }
  } catch (error) {
    console.error('Error ensuring system admin:', error);
  }
}

// Call this when the application starts
ensureSystemAdmin();

export type ActivityAction =
  | 'CREATE_STUDENT'
  | 'UPDATE_STUDENT'
  | 'DELETE_STUDENT'
  | 'CREATE_COURSE'
  | 'UPDATE_COURSE'
  | 'DELETE_COURSE'
  | 'CREATE_CERTIFICATE'
  | 'REVOKE_CERTIFICATE'
  | 'BULK_REVOKE_CERTIFICATES'
  | 'BULK_DOWNLOAD_CERTIFICATES'
  | 'DOWNLOAD_CERTIFICATE'
  | 'GENERATE_CERTIFICATE'
  | 'VERIFY_CERTIFICATE'
  | 'CREATE_PLACEMENT'
  | 'UPDATE_PLACEMENT'
  | 'DELETE_PLACEMENT'
  | 'CREATE_COMPANY'
  | 'UPDATE_COMPANY'
  | 'DELETE_COMPANY'
  | 'CREATE_ENROLLMENT'
  | 'UPDATE_ENROLLMENT'
  | 'INVITE_ADMIN'
  | 'VERIFY_ADMIN'
  | 'SETUP_ADMIN';

type EntityType =
  | 'student'
  | 'course'
  | 'certificate'
  | 'enrollment'
  | 'placement'
  | 'company'
  | 'admin'
  | 'admin_invitation';

type LogActivityParams = {
  action: ActivityAction;
  entity: EntityType;
  entityId: string;
  details: Record<string, any>;
  adminId: string;
};

export async function logActivity({
  action,
  entity,
  entityId,
  details,
  adminId,
}: LogActivityParams) {
  try {
    // If adminId is 'system', use the system admin ID
    const finalAdminId = adminId === 'system' ? SYSTEM_ADMIN_ID : adminId;

    await prisma.activityLog.create({
      data: {
        action,
        entity,
        entityId,
        details: JSON.stringify(details),
        adminId: finalAdminId,
      },
    });
  } catch (error) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logging activity:', error);
    }
    // Don't throw the error to prevent disrupting the main operation
  }
}
