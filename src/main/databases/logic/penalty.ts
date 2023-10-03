import { Op } from 'sequelize';
import { BorrowSchema, PenaltySchema, ReaderSchema, ReturnSchema, UserSchema, unitOfWork } from '../db';

export const createPenalty = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      let data = { ...request };
      delete data.createdBy;
      await PenaltySchema.update(data, { where: { id: request.id }, returning: true });
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
