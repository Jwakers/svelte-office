import { NextRequest } from 'next/server';

export default function verifyVercelCron(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment: Skipping cron verification');
    return;
  }

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401
    });
  }
}
