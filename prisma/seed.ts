// @ts-nocheck
const { PrismaClient, StudentStatus, AdminRole } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if super admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: 'sacredwebdev@gmail.com',
      },
    });

    if (!existingAdmin) {
      // Hash the password
      const hashedAdminPassword = await hash('Arindam@1995', 12);

      // Create super admin
      const superAdmin = await prisma.admin.create({
        data: {
          name: 'Super Admin',
          email: 'sacredwebdev@gmail.com',
          password: hashedAdminPassword,
          role: AdminRole.SUPER_ADMIN,
        },
      });
      console.log('Super admin created:', superAdmin.email);
    } else {
      console.log('Super admin already exists:', existingAdmin.email);
    }

    // Check if test student exists
    const existingStudent = await prisma.student.findUnique({
      where: {
        email: 'student@test.com',
      },
    });

    if (!existingStudent) {
      // Create a test student
      const hashedStudentPassword = await hash('student123', 12);

      const student = await prisma.student.create({
        data: {
          name: 'Test Student',
          email: 'student@test.com',
          phone: '+1234567890',
          password: hashedStudentPassword,
          status: StudentStatus.ACTIVE,
          // Create a test enrollment with a course
          enrollments: {
            create: {
              course: {
                create: {
                  title: 'Test Course',
                  description: 'A test course for certificate generation',
                  duration: 12, // 12 weeks
                  fee: 999.99,
                  status: 'ACTIVE',
                },
              },
              status: 'COMPLETED',
              startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
              endDate: new Date(), // Completed today
            },
          },
        },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });

      console.log('Created test student:', {
        id: student.id,
        name: student.name,
        email: student.email,
        enrollments: student.enrollments.map(
          /** @param {any} e */ (e) => ({
            course: e.course.title,
            status: e.status,
          })
        ),
      });
    } else {
      console.log('Test student already exists:', existingStudent.email);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
