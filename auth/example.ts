import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GmailAuthService } from './services/gmail-auth.service';

// TODO Delete
/**
 * Lists the labels in the user's account.*
 */
async function listLabels(auth: OAuth2Client): Promise<void> {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach(label => {
    console.log(`- ${label.name}`);
  });
}

// TODO Delete
const authService = new GmailAuthService();
authService.authorize().then(listLabels).catch(console.error);
