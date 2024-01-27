import { google } from 'googleapis';

export default function googleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    projectId: process.env.GCP_PROJECT_ID,
    scopes: ['https://www.googleapis.com/auth/content']
  });

  return auth;
}
