import { DocumentRequestSchema, unitOfWork } from '../db';

export const createDocumentRequest = async (request: any) => {
  console.log(request);
  return unitOfWork(async (transaction: any) => {
    const documentRequest = await DocumentRequestSchema.create(request, { transaction, returning: true, raw: true });
    return documentRequest.dataValues;
  });
};

export const getDocumentRequests = async (request: any) => {
  let query: any = {};
  if (request.name) query.name = request.name;
  if (request.id) query.id = request.id;

  return await DocumentRequestSchema.findAll({
    where: query,
    raw: true,
    order: [['id', 'DESC'], ['approvedAt', 'DESC']],
  });
};
