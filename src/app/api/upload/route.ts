// Cloudflare R2 Upload API Route
// Handles file uploads from admin panel and stores in R2

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const R2_ACCOUNT_ID = '2406fc9f7a319b479cc29572451099e1';
const R2_BUCKET_NAME = 'bhuvika-studio';
const R2_PUBLIC_URL = 'https://pub-9ea8f53d40124fda9e145365d1e24b1e.r2.dev';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'd6f3eedd02606edd2d5bfa318c916c18',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '83e6e70be4f1dbf2979cee2896f61e77554750839a92ed495684d61dfa54aab1',
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as string) || 'products';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const key = `${folder}/${fileName}`;

      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'image/jpeg',
      }));

      urls.push(`${R2_PUBLIC_URL}/${key}`);
    }

    return NextResponse.json({ urls });
  } catch (err: unknown) {
    console.error('R2 upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
