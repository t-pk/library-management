import { Op } from 'sequelize';
import { BorrowSchema, PenaltySchema, ReaderSchema, ReturnSchema, UserSchema, sequelize, unitOfWork } from '../db';
import { minusDays, formatDayMonth, addDays } from '../../../renderer/utils/helper';

export const createPenalty = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      let data = { ...request };
      delete data.createdBy;
      await PenaltySchema.update(data, { where: { id: request.id }, transaction, returning: true });
      return request;
    }
    const penalty = await PenaltySchema.create(request, { transaction, returning: true, raw: true });
    return penalty.dataValues;
  });
};

export const getPenalties = async (request: any) => {
  let readerQuery: any = {};
  let penaltyQuery: any = {};
  if (request.id) penaltyQuery.id = request.id;

  if (request.readerId) readerQuery.id = request.readerId;

  if (request.fullName) readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };

  if (request.studentId) readerQuery.studentId = request.studentId;

  if (request.readerTypeId) readerQuery.readerTypeId = request.readerTypeId;

  if (request.civilServantId) readerQuery.civilServantId = request.civilServantId;

  const penalties = await PenaltySchema.findAll({
    where: penaltyQuery,
    include: [
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      {
        model: ReturnSchema,
        required: true,
        include: [
          {
            model: BorrowSchema,
            required: true,
            include: [{ model: ReaderSchema, required: true, where: readerQuery }],
          },
        ],
      },
    ],
    order: [['id', 'DESC']],
  });
  let penaltiesJSON = penalties.map((penalty) => penalty.toJSON());
  return penaltiesJSON;
};

export const getPenaltyReports = async (request: any) => {
  const endDate = new Date();
  const startDate = minusDays(endDate, 9);
  let penalty = await PenaltySchema.findAll({
    where: { createdAt: { [Op.between]: [startDate, endDate] } },
    attributes: [
      [sequelize.literal("TO_CHAR(created_at, 'dd-mm')"), 'date'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'count'], // You can also count the rows in each group
    ],
    group: [sequelize.literal("TO_CHAR(created_at, 'dd-mm')") as any],
  });
  penalty = penalty.map((borrow: any) => borrow.toJSON());
  let labels: any[] = [];
  for (let i = 0; i < 10; i++) {
    const date = addDays(startDate, i);
    labels.push(date);
  }
  labels = labels.map((label: any) => formatDayMonth(label));
  let values = [];
  for (let i = 0; i < labels.length; i++) {
    const borrow: any = penalty.find((borrow: any) => borrow.date === labels[i]);
    if (borrow) values.push(+borrow.count);
    else values.push(0);
  }
  return { labels, values };
};
