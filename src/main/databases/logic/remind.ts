import { BorrowSchema, ReaderSchema, RemindSchema, ReturnSchema, UserSchema, sequelize, unitOfWork } from '../db';
import { Op } from 'sequelize';
import { formatDayMonth, addDays, minusDays } from '../../../renderer/utils/helper';

export const createRemind = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      let data = { ...request };
      delete data.createdBy;
      await RemindSchema.update(data, { where: { id: request.id }, transaction, returning: true });
      return request;
    }
    const document = await RemindSchema.create(request, { transaction, returning: true, raw: true });
    return document.dataValues;
  });
};

export const getReminds = async (request: any) => {
  let readerQuery: any = {};

  if (request.readerId) readerQuery.id = request.readerId;

  if (request.fullName) readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };

  if (request.studentId) readerQuery.studentId = request.studentId;

  if (request.readerTypeId) readerQuery.readerTypeId = request.readerTypeId;

  if (request.civilServantId) readerQuery.civilServantId = request.civilServantId;

  const reminds = await ReaderSchema.findAll({
    where: readerQuery,
    include: [
      {
        model: BorrowSchema,
        attributes: [],
        required: true,
        include: [{ model: ReturnSchema, attributes: [], required: true, include: [{ model: RemindSchema, attributes: [], required: true }] }],
      },
    ],
    attributes: ['id', 'fullName', 'studentId', 'civilServantId', [sequelize.fn('COUNT', sequelize.col('*')), 'total']],
    order: [['id', 'DESC']],
    group: ['readers.id', 'readers.full_name', 'readers.student_id', 'readers.civil_servant_id'],
  });
  let remindJSON = reminds.map((remind) => remind.toJSON());
  return remindJSON;
};

export const getRemindDetails = async (request: any) => {
  let query: any = {};
  if (request.fullName) query.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
  if (request.studentId) query.studentId = request.studentId;
  if (request.civilServantId) query.civilServantId = request.civilServantId;

  const reminds = await RemindSchema.findAll({
    include: [
      { model: UserSchema, as: 'createdInfo', attributes: ['fullName'] },
      {
        model: ReturnSchema,
        attributes: ['id'],
        required: true,
        include: [{ model: BorrowSchema, attributes: [], required: true, include: [{ model: ReaderSchema, attributes: [], where: query, required: true }] }],
      },
    ],
    order: [['id', 'DESC']],
  });
  let remindJSON = reminds.map((remind) => remind.toJSON());
  return remindJSON;
};

export const getRemindReports = async (request: any) => {
  const limit = 20;
  const endDate = new Date();
  const startDate = minusDays(endDate, limit - 1);
  let reminds = await RemindSchema.findAll({
    where: { createdAt: { [Op.between]: [startDate, endDate] } },
    attributes: [
      [sequelize.literal("TO_CHAR(created_at, 'dd-mm')"), 'date'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'count'], // You can also count the rows in each group
    ],
    group: [sequelize.literal("TO_CHAR(created_at, 'dd-mm')") as any],
  });
  reminds = reminds.map((borrow: any) => borrow.toJSON());
  let labels: any[] = [];
  for (let i = 0; i < limit; i++) {
    const date = addDays(startDate, i);
    labels.push(date);
  }
  labels = labels.map((label: any) => formatDayMonth(label));
  let values = [];
  for (let i = 0; i < labels.length; i++) {
    const borrow: any = reminds.find((borrow: any) => borrow.date === labels[i]);
    if (borrow) values.push(+borrow.count);
    else values.push(0);
  }
  return { labels, values };
};
