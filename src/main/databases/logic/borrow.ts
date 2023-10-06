import { Op } from 'sequelize';
import countBy from 'lodash.countby';
import { DocumentSchema, unitOfWork, BorrowSchema, BorrowDetailSchema, ReaderSchema, ReturnDetailSchema, UserSchema, sequelize } from '../db';
import { normalDocumentPeriod, specialDocumentPeriod } from '../../../renderer/constants/const';
import { formatYmd, addDays, minusDays, formatDayMonth } from '../../../renderer/utils/helper';

interface IObject {
  [key: string]: string | {};
}

export const getBorrows = async (request: any) => {
  let readerQuery: IObject = {};
  let borrowQuery: IObject = {};
  let borrowDetailQuery: IObject = {};

  if (request.documentIds && request.documentIds.length) {
    borrowDetailQuery.documentId = { [Op.in]: request.documentIds };
  }
  if (request.borrowId) borrowQuery.id = request.borrowId;
  if (request.fullName) readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
  if (request.studentId) readerQuery.studentId = request.studentId;
  if (request.readerTypeId) readerQuery.readerTypeId = request.readerTypeId;
  if (request.civilServantId) readerQuery.civilServantId = request.civilServantId;
  if (request.readerId) readerQuery.id = request.readerId;

  const borrows = await BorrowDetailSchema.findAll({
    where: borrowDetailQuery,
    include: [
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      {
        model: DocumentSchema,
      },
      {
        model: ReturnDetailSchema,
      },
      {
        model: BorrowSchema,
        where: borrowQuery,
        include: [
          {
            model: ReaderSchema,
            where: readerQuery,
          },
        ],
      },
    ],
    order: [
      ['borrowId', 'DESC'],
      ['id', 'DESC'],
    ],
  });
  let borrowsJSON = borrows.map((borrow) => borrow.toJSON());

  const borrowObj: { [key in string]: number } = countBy(borrows, 'borrowId');

  let resultObj: { [key in string]: number } = {};

  const limit = 20;
  let count = 0;
  let mark = 0;

  for (const [_, value] of Object.entries(borrowObj).reverse()) {
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
  borrowsJSON = borrowsJSON.map((borrow, index) => ({
    ...borrow,
    countBorrowId: borrowObj[borrow.borrowId],
    rest: resultObj[index] || 0,
  }));
  return borrowsJSON;
};

export const createBorrow = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    const borrow = {
      readerId: request.readerId,
      createdBy: request.createdBy,
    };

    const borrowRes = await BorrowSchema.create(borrow, {
      transaction,
      raw: true,
      returning: true,
    });
    const documents = await DocumentSchema.findAll({ where: { id: { [Op.in]: request.documentIds } }, transaction, raw: true });

    const checkDoc: any = documents.find((document: any) => document.availableQuantity < 1);

    if (checkDoc) throw `Tài Liệu ${checkDoc.name} đã hết. Vui lòng kiểm tra số lượng`;

    documents.forEach(async (document: any) => {
      const data = {
        availableQuantity: document.availableQuantity - 1,
      };
      await DocumentSchema.update(data, { where: { id: document.id }, transaction });
    });

    const borrowDetails = documents.map((document: any) => {
      let durationTime: any = new Date();
      durationTime = addDays(durationTime, document.special ? specialDocumentPeriod : normalDocumentPeriod);
      const brrowerDetail = {
        borrowId: borrowRes.dataValues.id,
        documentId: +document.id,
        quantity: 1,
        createdBy: request.createdBy,
        durationTime: formatYmd(durationTime),
      };
      return brrowerDetail;
    });
    await BorrowDetailSchema.bulkCreate(borrowDetails, { transaction, returning: true });
    return borrowRes.dataValues;
  });
};

export const getBorrowReports = async (request: any) => {
  const limit = 20;
  const endDate = new Date();
  const startDate = minusDays(endDate, limit - 1);
  let borrows = await BorrowSchema.findAll({
    where: { createdAt: { [Op.between]: [startDate, endDate] } },
    attributes: [
      [sequelize.literal("TO_CHAR(created_at, 'dd-mm')"), 'date'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
    ],
    group: [sequelize.literal("TO_CHAR(created_at, 'dd-mm')") as any],
  });
  borrows = borrows.map((borrow: any) => borrow.toJSON());
  let labels: any[] = [];
  for (let i = 0; i < limit; i++) {
    const date = addDays(startDate, i);
    labels.push(date);
  }
  labels = labels.map((label: any) => formatDayMonth(label));
  let values = [];
  for (let i = 0; i < labels.length; i++) {
    const borrow: any = borrows.find((borrow: any) => borrow.date === labels[i]);
    if (borrow) values.push(+borrow.count);
    else values.push(0);
  }
  return { labels, values };
};
