import { Transaction } from 'sequelize';
import { unitOfWork, AuthorSchema } from '../db';

export const authorSeeds = [
  {
    name: 'PGS.TS. Đặng Thành Tín',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Nguyễn Thị Hồng Nhung (KTL)',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Trần Công Nghị',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'GS. TS. Võ Văn Sen',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'TS. Đoàn Thanh Nghị',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'PGS.TS. Nguyễn Hồng Sinh',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'TS. Mai Hùng Thanh Tùng',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Phan Tấn Quốc',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Nguyên Hồng',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Peter Arnett',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Tô Hoài',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Thomas M. Campbell II & T. Colin Campbell',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Leopold Cadiere',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'DK',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'Ngô Thị Thanh Vân',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'GS. TS Lê Hoài Bắc',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'TS. Bùi Tiến Lên',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
];

export const createAuthors = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    data = data.map((item: any, index: number) => ({ ...item }));
    return AuthorSchema.bulkCreate(data, { transaction });
  });
};
