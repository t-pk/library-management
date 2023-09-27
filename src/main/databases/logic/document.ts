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

    return await DocumentSchema.findAll({
      where: query,
      include: [AuthorSchema, PublisherSchema, DocumentTypeSchema],
      raw: true,
      limit: 50,
    });
  } catch (error) {
    console.log('getDocuments', error);
  }
};

export const createDocument = async (request: any) => {
  return unitOfWork((transaction: any) => {
    return DocumentSchema.create(request, { transaction, returning: true });
  });
};
