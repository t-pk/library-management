import { UserSchema, unitOfWork } from '../db';
import { encryptPassword } from '../../../renderer/utils/authenticate';
import { Op } from 'sequelize';

export const getUser = async (request: any) => {
  const password = encryptPassword(request.password);
  const result: any = await UserSchema.findOne({
    where: { username: request.username, password },
    raw: true,
    attributes: ['id', 'username', 'position', 'fullName', 'email', 'phoneNumber', 'status'],
  });
  if (result && !result.status) throw 'Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ admin để hỗ trợ.';
  return result;
};

export const getUsers = async (request: any) => {
  let query = { ...request };
  if (request.fullName) query.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
  if (request.username) query.username = { [Op.iLike]: '%' + request.username + '%' };
  if (query.password) delete query.password;

  const result = await UserSchema.findAll({
    where: query,
    attributes: { exclude: ['password'] },
    include: [
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      { model: UserSchema, as: 'updatedInfo', attributes: ['fullName'] },
    ],
  });
  return result.map((user) => user.toJSON());
};

export const createUser = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      let data = { ...request };
      delete data.password;
      delete data.createdBy;
      await UserSchema.update(data, { where: { id: request.id }, transaction, returning: true });
      return request;
    }
    request.password = encryptPassword(request.password);
    const result = await UserSchema.create(request, { transaction });
    return result.dataValues;
  });
};

export const changePassword = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    delete request.createdBy;
    request.password = encryptPassword(request.password);
    const user = await UserSchema.findOne({ where: { id: request.id, password: request.password } });
    if (!user) throw 'Mật khẩu hiện tại không đúng, vui lòng kiểm tra lại.';

    await UserSchema.update({ password: encryptPassword(request.newPassword) }, { where: { id: request.id }, transaction, returning: true });
    return { id: request.id };
  });
};

export const resetPassword = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    delete request.createdBy;
    request.password = encryptPassword(request.password);
    await UserSchema.update({ password: request.password }, { where: { id: request.id }, transaction, returning: true });
    return { id: request.id };
  });
};
