import { Op } from 'sequelize';
import { AuthorSchema, DocumentSchema, PublisherSchema, unitOfWork, DocumentTypeSchema } from '../db';

export const getDocuments = async (request: any) => {
  try {
    let query: any = {};
    if (request.name) {
      query.name = { [Op.iLike]: '%' + request.name + '%' };
    }

    if (request.id) query.id = request.id;

    if (request.type) query.type = request.type;

    if (request.publishYear) query.publishYear = request.publishYear;

    if (request.special || request.special === false) query.special = request.special;

    if (request.documentTypes && request.documentTypes.length > 0) {
      query.documentTypeId = { [Op.in]: request.documentTypes };
    }
    if (request.publishers && request.publishers.length > 0) {
      query.publisherId = { [Op.in]: request.publishers };
    }
    if (request.authors && request.authors.length > 0) {
      query.authorId = { [Op.in]: request.authors };
    }

    const result = await DocumentSchema.findAll({
      where: query,
      include: [AuthorSchema, PublisherSchema, DocumentTypeSchema],
      limit: 50,
    });
    return result.map((document) => document.toJSON());
  } catch (error) {
    throw error;
  }
};

export const createDocument = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      await DocumentSchema.update(request, { where: { id: request.id },transaction, returning: true });
      return request;
    }
    const document = await DocumentSchema.create(request, { transaction, returning: true, raw: true });
    return document.dataValues;
  });
};
