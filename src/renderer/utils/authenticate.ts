import { scryptSync } from 'crypto';

export const encryptPassword = (password: string) => {
  const key = scryptSync(password, 'EE101^^_ii_^^101EE', 64).toString('hex')
  return key;
}
