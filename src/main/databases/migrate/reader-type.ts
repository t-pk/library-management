import { Transaction } from 'sequelize';
import { unitOfWork, ReaderTypeSchema } from '../db';

export const readerTypeSeeds = [
  {
    id: 1,
    name: 'Sinh Viên',
    status: true,
  },
  {
    id: 2,
    name: 'Cán Bộ - Nhân Viên',
    status: true,
  },
];

export const createReaderTypes = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    return ReaderTypeSchema.bulkCreate(data, { transaction });
  });
};
