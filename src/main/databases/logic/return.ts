import { Op } from 'sequelize';
import countBy from 'lodash.countby';
import { BorrowDetailSchema, DocumentSchema, ReaderSchema, ReturnDetailSchema, ReturnSchema, unitOfWork } from '../db';

interface IObject {
  [key: string]: string | {};
}

export const createReturn = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    const returnData: any = await ReturnSchema.findOrCreate({
      where: {
        borrowId: request.borrowId,
        createdBy: 2,
        readerId: request.readerId,
        description: request.description || '',
      },
      transaction,
      raw: true,
      returning: true,
    });
    const borrowDetails = await BorrowDetailSchema.findAll({
      where: {
        borrowId: request.borrowId,
        documentId: { [Op.in]: request.documentIds },
      },
      raw: true,
      transaction,
    });
    const retrurnDetails = borrowDetails.map((borrowDetail: any) => ({
      borrowDetailId: borrowDetail.id,
      returnId: returnData[0].id,
      createdBy: request.createdBy,
    }));
    return await ReturnDetailSchema.bulkCreate(retrurnDetails, {
      transaction,
      returning: true,
    });
  });
};

export const getReturns = async (request: any) => {
  try {
    let readerQuery: IObject = {};
    let returnQuery: IObject = {};
    let borrowDetail: IObject = {};

    if (request.documentIds && request.documentIds.length) {
      borrowDetail.documentId = { [Op.in]: request.documentIds };
    }
    if (request.id) returnQuery.id = request.id;
    if (request.fullName) readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
    if (request.studentId) readerQuery.studentId = request.studentId;
    if (request.readerTypeId) readerQuery.readerTypeId = request.readerTypeId;
    if (request.civilServantId) readerQuery.civilServantId = request.civilServantId;

    if (request.readerId) readerQuery.id = request.readerId;

    const returnDetails = await ReturnDetailSchema.findAll({
      include: [
        {
          model: ReturnSchema,
          include: [
            {
              model: ReaderSchema,
              where: readerQuery,
            },
          ],
          required: true,
        },
        {
          model: BorrowDetailSchema,
          include: [
            {
              model: DocumentSchema,
            },
          ],
          where: borrowDetail,
        },
      ],
      order: [
        ['returnId', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    let returnJSON = returnDetails.map((iReturn) => iReturn.toJSON());

    const returnObj: { [key in string]: number } = countBy(returnDetails, 'returnId');
    let resultObj: { [key in string]: number } = {};

    const limit = 20;
    let count = 0;
    let mark = 0;

    for (const [_, value] of Object.entries(returnObj).reverse()) {
      count += value;
      if (Math.floor(count / limit) > mark) {
        let start = mark * limit;
        const end = count;

        let jump = Math.floor(count / limit) - mark;

        if (jump <= 0) continue;
        else {
          while (jump > 0) {
            ++mark;
            while (start + limit < end) {
              resultObj[start + limit] = mark * limit - (count - value);
              start++;
            }
            jump--;
          }
        }
      }
    }
    returnJSON = returnJSON.map((iReturn, index) => ({
      ...iReturn,
      countReturnId: returnObj[iReturn.returnId],
      rest: resultObj[index] || 0,
    }));

    return returnJSON;
  } catch (error) {
    throw error;
  }
};
