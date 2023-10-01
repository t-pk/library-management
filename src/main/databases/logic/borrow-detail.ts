import { Op } from 'sequelize';
import { BorrowDetailSchema, DocumentSchema, ReturnDetailSchema, ReturnSchema } from '../db';

export const getBorrowDetail = async (request: any) => {
  let query: any = {};
  if (request.borrowId) query.borrowId = request.borrowId;
  const returnDocuments = await ReturnDetailSchema.findAll({
    include: [{ model: ReturnSchema, where: { borrowId: request.borrowId } }],
    attributes: ['borrowDetailId'],
    raw: true,
  });

  if (returnDocuments && returnDocuments.length > 0) {
    const returnDocumentsJson = returnDocuments.map((item: any) => item.borrowDetailId);
    query.id = { [Op.notIn]: returnDocumentsJson };
  }

  const documentIds = await BorrowDetailSchema.findAll({
    where: query,
    raw: true,
    order: [['id', 'ASC']],
    attributes: ['documentId'],
  });
  return await DocumentSchema.findAll({
    where: {
      id: { [Op.in]: documentIds.map(({ documentId }: any) => documentId) },
    },
    raw: true,
    order: [['id', 'ASC']],
  });
};
