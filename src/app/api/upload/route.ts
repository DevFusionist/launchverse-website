import { NextRequest, NextResponse } from 'next/server';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from '@/lib/cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: 'Only super admin can delete uploads' },
        { status: 403 }
      );
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const url = await uploadToCloudinary(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: 'Only super admin can delete uploads' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      return NextResponse.json(
        { error: 'Invalid Cloudinary URL' },
        { status: 400 }
      );
    }

    await deleteFromCloudinary(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
