import { Transaction } from 'sequelize';
import { UserSchema, unitOfWork } from '../db';
import { encryptPassword } from '../../../renderer/utils/authenticate';

export const userSeeds = [
  {
    username: 'admin',
    password: '123456',
    fullName: 'Tommy',
    email: 'T@gmail.com',
    phoneNumber: '01234567890',
    status: true,
    position: 'ADMIN',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    username: 'staff1',
    fullName: 'Nguyen Van A',
    password: '123456',
    email: 'staff1@gmail.com',
    phoneNumber: '09876543210',
    status: true,
    position: 'STAFF',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    username: 'staff2',
    fullName: 'Nguyen Van B',
    password: '123456',
    email: 'staff2@gmail.com',
    phoneNumber: '09876543211',
    status: true,
    position: 'STAFF',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    username: 'staff3',
    fullName: 'Nguyen Van C',
    password: '123456',
    email: 'staff3@gmail.com',
    phoneNumber: '09876543212',
    status: true,
    position: 'STAFF',
    createdBy: 1,
    updatedBy: 1,
  },
  {
    username: 'staff4',
    fullName: 'Nguyen Van D',
    password: '123456',
    email: 'staff4@gmail.com',
    phoneNumber: '09876543213',
    status: true,
    position: 'STAFF',
    createdBy: 1,
    updatedBy: 1,
  },
];

export const createUsers = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    data = data.map((item: any) => ({ ...item, password: encryptPassword(item.password) }));
    return UserSchema.bulkCreate(data, { transaction });
  });
};
