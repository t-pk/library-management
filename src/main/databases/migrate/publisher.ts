import { Transaction } from 'sequelize';
import { unitOfWork, PublisherSchema } from '../db';

export const publisherSeeds = [
  {
    name: 'NXB ĐH Quốc Gia TP.Hồ Chí Minh',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'NXB Bộ Giáo Dục',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'NXB Thông Tin Và Truyền Thông',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
  {
    name: 'NXB Thế Giới',
    status: true,
    createdBy: 1,
    updatedBy: 1,
  },
];

export const createPublisher = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    data = data.map((item: any, index: number) => ({ ...item, id: index + 1 }));
    return PublisherSchema.bulkCreate(data, { transaction });
  });
};
