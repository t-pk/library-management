import { Op } from 'sequelize';
import { BorrowerDetailSchema, ReturnDetailSchema, ReturnSchema, unitOfWork } from '../db';

export const createReturn = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    const returnData: any = await ReturnSchema.findOrCreate({
      where: {
        borrowerId: request.borrowerId,
        createdBy: 2,
        readerId: request.readerId,
        description: request.description || 'TAIPHAM'
      }, transaction, raw: true, returning: true
    });
    const borrowerDetails = await BorrowerDetailSchema.findAll({ where: { borrowerId: request.borrowerId, documentId: { [Op.in]: request.documentIds } }, raw: true, transaction });
    const retrurnDetails = borrowerDetails.map((borrowerDetail: any) => ({ borrowerDetailId: borrowerDetail.id, returnId: returnData[0].id, createdBy: request.createdBy }));
    return await ReturnDetailSchema.bulkCreate(retrurnDetails, { transaction, returning: true });
  })
}