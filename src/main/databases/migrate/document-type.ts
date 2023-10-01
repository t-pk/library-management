import { Transaction } from 'sequelize';
import { DocumentTypeSchema, unitOfWork } from '../db';

export const documentTypeSeeds = [
  {
    id: 1,
    name: 'Sách',
    status: true,
  },
  {
    id: 2,
    name: 'Tạp Chí',
    status: true,
  },
  {
    id: 3,
    name: 'Nhật Kí',
    status: true,
  },
  {
    id: 4,
    name: 'Tiểu Thuyết',
    status: true,
  },
  {
    id: 5,
    name: 'Hồi Ký',
    status: true,
  },
  {
    id: 6,
    name: 'Văn Bản',
    status: true,
  },
  {
    id: 7,
    name: 'Bản Vẽ Thiết Kế',
    status: true,
  },
  {
    id: 8,
    name: 'Công Trình Nghiên Cứu',
    status: true,
  },
  {
    id: 9,
    name: 'Dự án',
    status: true,
  },
  {
    id: 10,
    name: 'Bút Tích',
    status: true,
  },
  {
    id: 11,
    name: 'Truyện',
    status: true,
  },
];

export const createDocumentTypes = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    return DocumentTypeSchema.bulkCreate(data, { transaction });
  });
};
