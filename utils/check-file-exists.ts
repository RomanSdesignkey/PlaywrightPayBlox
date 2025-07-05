import { constants } from 'node:fs';
import fs from 'node:fs/promises';

export async function checkFileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
