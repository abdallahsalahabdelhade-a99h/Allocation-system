import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  // Protect the route
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Read the file from the parent directory
    const filePath = join(process.cwd(), '..', 'Smart Student Allocation System.html');
    const htmlContent = readFileSync(filePath, 'utf8');

    // Return the HTML content
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        // Prevent framing by external sites, but allow self
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('Error reading allocation HTML:', error);
    return new NextResponse('Internal Server Error: Could not load allocation system.', { status: 500 });
  }
}
