import { Op } from "sequelize";
import countBy from "lodash.countby";
import { DocumentSchema, unitOfWork, BorrowerSchema, BorrowerDetailSchema, ReaderSchema, sequelize } from "../db";

interface IObject {
  [key: string]: string | {}
}

export const getBorrowers = async (request: any) => {
  try {
    let readerQuery: IObject = {};
    let borrowerQuery: IObject = {};

    if (request.id) borrowerQuery.id = request.id;
    if (request.fullName) readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
    if (request.studentId) readerQuery.studentId = request.studentId;
    if (request.civilServantId) readerQuery.civilServantId = request.civilServantId;
    if (request.readerId) readerQuery.id = request.readerId;

    const borrowers = await BorrowerDetailSchema.findAll({
      include: [{
        model: DocumentSchema
      },
      {
        model: BorrowerSchema,
        where: borrowerQuery,
        include: [{
          model: ReaderSchema,
          where: readerQuery
        }]
      }],
      order: [['borrowerId', 'DESC'], ['id', 'DESC']],
    });
    let borrowersJSON = borrowers.map(borrower => borrower.toJSON());

    const borrowerObj: { [key in string]: number } = countBy(borrowers, 'borrowerId');

    let resultObj: { [key in string]: number } = {};

    const limit = 20;
    let count = 0;
    let mark = 0;

    for (const [_, value] of Object.entries(borrowerObj).reverse()) {
      count += value;
      if (Math.floor(count / limit) > mark) {
        let start = mark * limit;
        const end = count;

        let jump = Math.floor(count / limit) - mark;

        if (jump <= 0) continue;

        else {
          while (jump > 0) {
            ++mark;
            while ((start + limit) < end) {
              resultObj[start + limit] = (mark * limit) - (count - value);
              start++;
            }
            jump--;
          }
        }
      }
    }
    borrowersJSON = borrowersJSON.map((borrower, index) => ({ ...borrower, countBorrowerId: borrowerObj[borrower.borrowerId], rest: resultObj[index] || 0 }));
    return borrowersJSON;
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

    const borrowerDetail = request.documentIds.map((documentId: any) => ({
      borrowerId: borrowerRes.dataValues.id,
      documentId: +documentId, quantity: 1,
      createdBy: request.createdBy
    }));
    return BorrowerDetailSchema.bulkCreate(borrowerDetail, { transaction });
  })
}