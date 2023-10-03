import { Op } from 'sequelize';
import { DocumentRequestSchema, UserSchema, unitOfWork } from '../db';

export const createDocumentRequest = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.key && request.ids && request.ids.length) {
      let data: any = { status: request.key };
      if (request.key === 'approved') {
        data.approvedBy = request.createdBy;
        data.approvedAt = Date.now();
      }
      if (request.key === 'rejected') {
        data.rejectedBy = request.createdBy;
        data.rejectedAt = Date.now();
      }
      const documentRequest = await DocumentRequestSchema.update(data, { where: { id: { [Op.in]: request.ids } }, transaction, returning: true });
      return documentRequest[0];
    }
    const documentRequest = await DocumentRequestSchema.create(request, { transaction, returning: true, raw: true });
    return documentRequest.dataValues;
  });
};

export const getDocumentRequests = async (request: any) => {
  let query: any = {};
  if (request.name) query.name = request.name;
  if (request.id) query.id = request.id;

  const result = await DocumentRequestSchema.findAll({
    where: query,
    include: [
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      { model: UserSchema, as: 'approvedInfo', attributes: ['fullName'] },
      { model: UserSchema, as: 'rejectedInfo', attributes: ['fullName'] },
    ],
    order: [
      ['id', 'DESC'],
      ['approvedAt', 'DESC'],
    ],
  });

  return result.map((documentRequest) => documentRequest.toJSON());
};
