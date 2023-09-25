import { Op } from "sequelize";
import { BorrowerDetailSchema, DocumentSchema, ReturnDetailSchema, ReturnSchema } from "../db";

export const getBorrowerDetail = async (request: any) => {
  try {

    let query: any = {};
    if (request.borrowerId) query.borrowerId = request.borrowerId;
    const returnDocuments = await ReturnDetailSchema.findAll({ include: [{ model: ReturnSchema, where: { borrowerId: request.borrowerId } }], attributes: ['borrowerDetailId'], raw: true });

    if (returnDocuments && returnDocuments.length > 0) {
      const returnDocumentsJson = returnDocuments.map((item: any) => item.borrowerDetailId);
      query.id = { [Op.notIn]: returnDocumentsJson };
    }

    const documentIds = await BorrowerDetailSchema.findAll({ where: query, raw: true, order: [["id", "ASC"]], attributes: ['documentId'] });
    return await DocumentSchema.findAll({ where: { id: { [Op.in]: documentIds.map(({ documentId }: any) => documentId) } }, raw: true, order: [["id", "ASC"]] });
  } catch (error) {
    console.log("getDocumentTypes", error);
  }
}
