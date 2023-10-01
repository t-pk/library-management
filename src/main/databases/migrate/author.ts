import { Transaction } from "sequelize";
import { unitOfWork, AuthorSchema } from "../db";

export const authorSeeds = [
  {
    name: 'Lê Tiến Thường', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Vũ Đỗ Huy Cường', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Trần Công Nghị', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'GS. TS. Võ Văn Sen', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'TS. Đoàn Thanh Nghị', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'PGS.TS. Nguyễn Hồng Sinh', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'TS. Mai Hùng Thanh Tùng', status: true, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Phan Tấn Quốc', status: true, createdBy: 1, updatedBy: 1,
  },
  
]

export const createAuthors = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    data = data.map((item: any, index: number) => ({ ...item, id: index + 1 }));
    return AuthorSchema.bulkCreate(data, { transaction });
  })
}
