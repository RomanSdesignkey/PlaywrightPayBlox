import path from 'node:path';
import fs from 'node:fs';
import { checkEnvVarsSet } from '../utils/check-env-vars-set';

const envFilePath = path.resolve(__dirname, '..', '.env');
const envExampleFilePath = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envFilePath)) {
  throw new Error('.env file is not found in the project root');
}

process.loadEnvFile(envFilePath);
checkEnvVarsSet(envExampleFilePath);

export const config = {};
