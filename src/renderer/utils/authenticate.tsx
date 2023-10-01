import { scryptSync } from 'crypto';

export const encryptPassword = (password: string) => {
  const hash = scryptSync(password, `'ExE101^^_i.+.i_^^101ExE'`, 64).toString('hex');
  return hash;
};
