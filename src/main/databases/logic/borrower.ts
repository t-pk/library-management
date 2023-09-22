import { Op } from "sequelize";
import { DocumentSchema, unitOfWork, BorrowerSchema, BorrowerDetailSchema, ReaderSchema, sequelize } from "../db";

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

    const borrowers = await BorrowerDetailSchema.findAll({
      where: query, include: [{
        model: DocumentSchema
      },
      {
        model: BorrowerSchema,
        include: [{
          model: ReaderSchema
        }]
      }],
    });
    let borrowersJSON = borrowers.map(borrower => borrower.toJSON());
    const borrowerIds = await BorrowerDetailSchema.findAll({
      where: query, attributes: [
        'borrowerId',
        [sequelize.fn('COUNT', sequelize.col('borrower_id')), 'countBorrowerId'],
      ],
      group: ['borrower_id'],
      raw: true
    });

    const borrowerObj: { [key in string]: number } = borrowerIds.reduce((obj, item: any) => ({ ...obj, [item.borrowerId]: +item.countBorrowerId }), {});

    let resultObj: any = {};

    const caculate = () => {

      const limit = 10;
      let count = 0;
      let mark = 0;

      for (const [key, value] of Object.entries(borrowerObj)) {
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
    }
    caculate();
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