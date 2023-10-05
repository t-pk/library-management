import { Op } from 'sequelize';
import {
  AuthorSchema,
  DocumentSchema,
  PublisherSchema,
  unitOfWork,
  DocumentTypeSchema,
  UserSchema,
  BorrowDetailSchema,
  sequelize,
  ReturnDetailSchema,
} from '../db';

export const getDocuments = async (request: any) => {
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

  if (request.availableQuantity) {
    query.availableQuantity = { [Op.gte]: request.availableQuantity };
  }

  const result = await DocumentSchema.findAll({
    where: query,
    include: [
      AuthorSchema,
      PublisherSchema,
      DocumentTypeSchema,
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      { model: UserSchema, as: 'updatedInfo', attributes: ['fullName'] },
    ],
    limit: 50,
    order: [['updatedAt', 'DESC']],
  });
  return result.map((document) => document.toJSON());
};

export const createDocument = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      let data = { ...request };
      delete data.createdBy;
      await DocumentSchema.update(data, { where: { id: request.id }, transaction, returning: true });
      return request;
    }
    const document = await DocumentSchema.create(request, { transaction, returning: true, raw: true });
    return document.dataValues;
  });
};

export const getDocumentReports = async (request: any) => {
  const limit = 40;
  let borrowCount = await BorrowDetailSchema.findAll({
    attributes: [
      'document_id',
      'document.name',
      [sequelize.fn('COUNT', sequelize.col('document_id')), 'count'], // You can also count the rows in each group
    ],
    group: ['document_id', 'document.name'],
    raw: true,
    include: [{ model: DocumentSchema, attributes: ['name'] }],
    order: [['count', 'DESC']],
    limit: limit,
  });

  let returnCount = await ReturnDetailSchema.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('borrowDetail->document.id')), 'count'], // You can also count the rows in each group
    ],
    group: ['borrowDetail->document.id', 'borrowDetail->document.name'],
    raw: true,
    include: [{ model: BorrowDetailSchema, required: true, attributes: [], include: [{ model: DocumentSchema, attributes: ['name'], required: true }] }],
    order: [['count', 'DESC']],
    limit: limit,
  });

  const returnValues = borrowCount.map((borrow: any) => {
    const isExist: any = returnCount.find((iReturn: any) => iReturn['borrowDetail.document.name'] === borrow['document.name']);
    if (isExist) return +isExist.count;
    else return 0;
  });

  const result: any =  {
    labels: borrowCount.map((borrow: any) => borrow['document.name'].substring(0, 30) + (borrow['document.name'].length > 30 ? '....' : '')),
    borrowValues: borrowCount.map((borrow: any) => +borrow.count),
    returnValues: returnValues,
  };
  const avgValues = result.borrowValues.map((value: any, index:number)=> (value+result.returnValues[index])/2);
  result.avgValues = avgValues;
  return result;
};
