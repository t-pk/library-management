import { UserSchema } from '../db';
import { encryptPassword } from '../../../renderer/utils/authenticate';

export const getUser = async (request: any) => {
  const password = encryptPassword(request.password);
  const result = await UserSchema.findOne({
    where: { username: request.username, password },
    raw: true,
    attributes: ['id', 'username', 'position', 'fullName', 'email', 'phoneNumber'],
  });
  return result;
};
