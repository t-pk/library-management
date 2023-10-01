import { Transaction } from "sequelize";
import { unitOfWork, DocumentSchema } from "../db";

export const documentSeeds = [
  {
    name: 'Lý thuyết tàu. Tập 1: Tĩnh học và động lực học tàu', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Lý thuyết tàu - Tập 2 - Sức cản vỏ tàu và thiết bị đẩy tàu', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Hướng dẫn thiết kế tàu vận tải đi biển', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Sức bền tàu thủy', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Lý thuyết tàu thủy. Tập 3: Thiết kế chân vịt tàu thủy', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Độ bền kết cấu vật liệu composite', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Thiết kế giàn khoan di động, FPSO, tàu dịch vụ ngoài khơi', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Thiết kế tàu cỡ nhỏ chạy nhanh', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Giáo trình Lập trình Web', documentTypeId: 1, publisherId: 1, authorId: 3, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Giáo trình Lập trình Java cơ bản', documentTypeId: 1, publisherId: 1, authorId: 5, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Một số vấn đề cấp bách trong quá trình CNH-HĐH của người Khmer ở đồng bằng sông Cửu long', documentTypeId: 1, publisherId: 1, authorId: 4, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Nam Bộ Đất và Người: Tập XIII', documentTypeId: 1, publisherId: 1, authorId: 4, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Nam Bộ - Đất và Người (tập XVI)', documentTypeId: 1, publisherId: 1, authorId: 4, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Nguồn tài nguyên thông tin (Giáo trình dành cho SV ngành Thư viện - Thông tin học)', documentTypeId: 1, publisherId: 1, authorId: 6, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Sách chuyên khảo Mô hình dịch vụ học thuật số áp dụng cho thư viện đại học', documentTypeId: 1, publisherId: 1, authorId: 6, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Giáo trình Hợp chất thiên nhiên ứng dụng trong hóa mỹ phẩm', documentTypeId: 1, publisherId: 1, authorId: 7, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Giáo trình Kỹ thuật lập trình', documentTypeId: 1, publisherId: 1, authorId: 8, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
]

export const createDocuments = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    const minYear = 2000;
    const maxYear = 2022;

    data = data.map((item: any, index: number) => ({ ...item, id: index + 1, publishYear: Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear }));
    return DocumentSchema.bulkCreate(data, { transaction });
  })
}
