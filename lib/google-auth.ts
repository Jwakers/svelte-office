import { readFileSync } from 'fs';
import { google } from 'googleapis';

export default function googleAuth() {
  const serviceAccountKey = JSON.parse(readFileSync('./svelte-office-4cfac2233c0d.json', 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/content']
  });

  return auth;
}
