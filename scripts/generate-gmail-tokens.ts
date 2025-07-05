import { GmailAuthService } from '../auth/services/gmail-auth.service';

const authService = new GmailAuthService();

async function generateGmailTokens(): Promise<void> {
  await authService.authorize();

  const tokenPath = authService.getTokenPath();

  console.log(`Tokens generated successfully in: ${tokenPath}`);
}

generateGmailTokens().catch(console.error);
