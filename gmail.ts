import { google } from 'googleapis';
import authenticate from './auth';

interface GmailMessage {
    id: string;
}

async function getLatestPlayboxEmail(): Promise<string | null> {
    const auth = await authenticate();
    const gmail = google.gmail({ version: 'v1', auth });

    // Fetch latest email from support@payblox.com
    const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 1,
        q: 'from:support@payblox.com',  // Filter emails only from this sender
    });

    if (!response.data.messages || response.data.messages.length === 0) {
        console.log("No new emails found from support@payblox.com.");
        return null;
    }

    const messageId = (response.data.messages[0] as GmailMessage).id;

    // Get email details
    const email = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
    });

    // Extract plain text from email
    const emailData = email.data.payload?.parts?.find(
        part => part.mimeType === 'text/plain'
    );

    if (!emailData || !emailData.body?.data) {
        console.log("Could not extract email body.");
        return null;
    }

    const emailBody = Buffer.from(emailData.body.data, 'base64').toString();
    
    return emailBody;
}

export default getLatestPlayboxEmail;
