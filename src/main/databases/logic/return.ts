import { Op } from 'sequelize';
import countBy from 'lodash.countby';
import { BorrowDetailSchema, DocumentSchema, ReaderSchema, ReturnDetailSchema, ReturnSchema, UserSchema, unitOfWork } from '../db';

interface IObject {
  [key: string]: string | {};
}

export const createReturn = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    let returnData: any = await ReturnSchema.findOrCreate({
      where: {
        borrowId: request.borrowId,
        readerId: request.readerId,
      },
      defaults: {
        description: request.description || '',
        createdBy: request.createdBy,
        borrowId: request.borrowId,
        readerId: request.readerId,
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

    const documents = await DocumentSchema.findAll({ where: { id: { [Op.in]: request.documentIds } }, transaction, raw: true });
    documents.forEach(async (document: any) => {
      const data = {
        availableQuantity: document.availableQuantity + 1,
      };
      await DocumentSchema.update(data, { where: { id: document.id }, transaction });
    });

    const retrurnDetails = borrowDetails.map((borrowDetail: any) => ({
      borrowDetailId: borrowDetail.id,
      returnId: returnData[0].id,
      createdBy: request.createdBy,
    }));
    await ReturnDetailSchema.bulkCreate(retrurnDetails, {
      transaction,
      returning: true,
    });
    return returnData[0].dataValues || returnData[0];
  });
};

export const getReturns = async (request: any) => {
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
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      {
        model: ReturnSchema,
        include: [
          {
            model: ReaderSchema,
            where: readerQuery,
          },
        ],
        where: returnQuery,
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
};
