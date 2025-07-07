import { OAuth2Client } from 'google-auth-library';
import fs from 'node:fs/promises';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'node:path';
import { checkFileExists } from '../../utils/check-file-exists';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, '..', 'google-credentials', 'token.json');
const CREDENTIALS_PATH = path.join(
  __dirname,
  '..',
  'google-credentials',
  'credentials.json',
);

export class GmailAuthService {
  constructor(
    private readonly tokenPath = TOKEN_PATH,
    private readonly credentialsPath = CREDENTIALS_PATH,
    private readonly scopes = SCOPES,
  ) {}

  getTokenPath(): string {
    return this.tokenPath;
  }

  async authorize(): Promise<OAuth2Client> {
    const savedClient = await this.getSavedAuthClient().catch(err => {
      console.log('Failed to get saved client', err);

      return null;
    });

    if (savedClient) {
      return savedClient;
    }

    console.log('No saved client found, creating new one');

    const isCredentialsFileExist = await checkFileExists(this.credentialsPath);

    if (!isCredentialsFileExist) {
      throw new Error(
        `Credentials file does not exist, create one in '${this.credentialsPath}' following the instructions:` +
          'https://developers.google.com/workspace/gmail/api/quickstart/nodejs#enable_the_api',
      );
    }

    const newClient = await authenticate({
      scopes: this.scopes,
      keyfilePath: this.credentialsPath,
    });

    if (newClient.credentials) {
      await this.saveCredentials(newClient);
    }

    return newClient;
  }

  /**
   * Reads previously authorized google-credentials from the save file and returns an auth client
   */
  async getSavedAuthClient(): Promise<OAuth2Client> {
    try {
      const content = await fs.readFile(this.tokenPath, 'utf-8');
      const credentials = JSON.parse(content);

      return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
      throw new Error('Error loading client secret file', { cause: err });
    }
  }

  /**
   * Serializes google-credentials to a file compatible with GoogleAuth.fromJSON.
   */
  private async saveCredentials(client: OAuth2Client): Promise<void> {
    const isCredentialsFileExist = await checkFileExists(this.credentialsPath);

    if (!isCredentialsFileExist) {
      throw new Error(
        `Credentials file does not exist, create one in '${this.credentialsPath}' following the instructions:` +
          'https://developers.google.com/workspace/gmail/api/quickstart/nodejs#enable_the_api',
      );
    }

    const content = await fs.readFile(this.credentialsPath, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });

    await fs.writeFile(this.tokenPath, payload, 'utf-8');
  }
}
