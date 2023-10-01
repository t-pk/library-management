import { Transaction } from "sequelize";
import { UserSchema, unitOfWork } from "../db";
import { encryptPassword } from '../../../renderer/utils/authenticate';

export const userSeeds = [
  {
    id: 1, username: "admin", password: '123456', email: 'T@gmail.com', phoneNumber: '01234567890', status: true, position: 'ADMIN', createdBy: 1, updatedBy: 1
  },
  {
    id: 2, username: "staff", password: '123456', email: 'staff@gmail.com', phoneNumber: '09876543210', status: true, position: 'STAFF', createdBy: 1, updatedBy: 1
  },
]

export const createUsers = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    data = data.map((item: any) => ({ ...item, password: encryptPassword(item.password) }));
    return UserSchema.bulkCreate(data, { transaction });
  })
}
