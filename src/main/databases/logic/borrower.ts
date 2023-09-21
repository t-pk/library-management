import { Op } from "sequelize";
import { AuthorSchema, DocumentSchema, PublisherSchema, unitOfWork, DocumentTypeSchema, BorrowerSchema, BorrowerDetailSchema } from "../db";

export const getBorrowers = async (request: any) => {
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
      query.documentTypeId = { [Op.in]: request.documentTypes }
    }
    if (request.publishers && request.publishers.length > 0) {
      query.publisherId = { [Op.in]: request.publishers }
    }
    if (request.authors && request.authors.length > 0) {
      query.authorId = { [Op.in]: request.authors }
    }

    return await DocumentSchema.findAll({ where: query, include: [AuthorSchema, PublisherSchema, DocumentTypeSchema], raw: true });
  } catch (error) {
    console.log("getDocuments", error);
  }
}

export const createBorrower = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    const borrower = {
      readerId: request.readerId,
      createdBy: request.createdBy
    };

    const borrowerRes = await BorrowerSchema.create(borrower, { transaction, raw: true, returning: true });
    console.log(borrowerRes.dataValues.id);
    const borrowerDetail = request.documentIds.map((documentId: any) => ({
      borrowerId: borrowerRes.dataValues.id,
      documentId: +documentId, quantity: 1,
      createdBy: request.createdBy
    }));
    return BorrowerDetailSchema.bulkCreate(borrowerDetail, { transaction });
  })
}