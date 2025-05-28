import * as http from 'http';
import * as fs from 'fs';
import { google } from 'googleapis';

const CREDENTIALS_PATH = './keys/auth_gmail_data.json';
const TOKEN_PATH = './keys/token.json';
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const PORT = 3000;

async function authenticate(): Promise<any> {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id } = credentials.installed;
  // Use your container's callback URL
  const redirectUri = `http://localhost:${PORT}/callback`;

  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirectUri
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(token);
    return oauth2Client;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  // Start an HTTP server to catch the OAuth callback
  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.url && req.url.startsWith('/callback')) {
        const urlObj = new URL(req.url, `http://localhost:${PORT}`);
        const code = urlObj.searchParams.get('code');
        res.end('Authentication successful! You can close this window.');
        server.close();
        if (code) resolve(code);
        else reject(new Error('No code received'));
      }
    }).listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT} for OAuth callback...`);
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('Token stored to', TOKEN_PATH);
  return oauth2Client;
}

export default authenticate;
