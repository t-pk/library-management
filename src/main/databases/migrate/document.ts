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
  {
    name: 'Hệ thống máy tính và ngôn ngữ C', documentTypeId: 1, publisherId: 1, authorId: 1, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Tin học II', documentTypeId: 1, publisherId: 1, authorId: 1, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Quyền tác giả trong không gian ảo', documentTypeId: 1, publisherId: 1, authorId: 2, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Giáo trình Luật tố tụng dân sự', documentTypeId: 1, publisherId: 1, authorId: 2, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Tài liệu học tập Luật tố tụng dân sự (Câu hỏi, bài tập tình huống và bản án)', documentTypeId: 1, publisherId: 1, authorId: 2, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Sách tham khảo Pháp luật Việt Nam dành cho doanh nghiệp và người nước ngoài - 200 câu hỏi-đáp (Việt-Anh-Trung)', documentTypeId: 1, publisherId: 1, authorId: 2, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Những Ngày Thơ Ấu', documentTypeId: 5, publisherId: 2, authorId: 9, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Từ Chiến Trường Khốc Liệt', documentTypeId: 5, publisherId: 2, authorId: 10, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Cát Bụi Chân Ai', documentTypeId: 5, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Quê người', documentTypeId: 4, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Dế Mèn phiêu lưu ký', documentTypeId: 11, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Nhà nghèo', documentTypeId: 11, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Núi cứu quốc', documentTypeId: 11, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Miền Tây', documentTypeId: 4, publisherId: 2, authorId: 11, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Bí Mật Dinh Dưỡng Cho Sức Khỏe Toàn Diện', documentTypeId: 1, publisherId: 3, authorId: 12, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Hồi Ký Của Một Ông Già Việt Học', documentTypeId: 5, publisherId: 4, authorId: 13, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Cẩm Nang Du Lịch - Top 10 Paris', documentTypeId: 2, publisherId: 4, authorId: 14, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Nghiên cứu thời gian tập trung dòng chảy hình thành lũ quét ở các khu vực giao mùa vùng núi phía Bắc Việt Nam', documentTypeId: 8, publisherId: 4, authorId: 15, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Các thuật toán nâng cao trong khai thác mẫu tuần tự và luật', documentTypeId: 8, publisherId: 1, authorId: 16, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },
  {
    name: 'Phát triển các thuật toán khai thác mẫu tuần tự và luật từ cơ sở dữ liệu chuỗi. (Nafosted, 2014-2016)', documentTypeId: 8, publisherId: 1, authorId: 17, special: false, status: true, quantity: 50, availableQuantity: 50, createdBy: 1, updatedBy: 1,
  },

]

export const createDocuments = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    const minYear = 2000;
    const maxYear = 2022;

    data = data.map((item: any, index: number) => ({ ...item, id: index + 1, publishYear: item.publishYear || Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear }));
    return DocumentSchema.bulkCreate(data, { transaction });
  })
}
