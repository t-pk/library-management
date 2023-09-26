
import countBy from "lodash.countby";
import { BorrowSchema, PenaltySchema, ReaderSchema, RemindSchema, sequelize, unitOfWork } from "../db";
import { Op } from "sequelize";

export const createPenalty = async (request: any) => {
  return unitOfWork((transaction: any) => {
    return PenaltySchema.create(request, { transaction });
  })
}

export const getPenalties = async (request: any) => {
  let readerQuery: any = {};
  if (request.readerId) {
    readerQuery.id = request.readerId;
  }
  if (request.fullName) {
    readerQuery.fullName = { [Op.iLike]: '%' + request.fullName + '%' };
  }
  if (request.studentId) {
    readerQuery.studentId = request.studentId;
  }
  if (request.readerTypeId) {
    readerQuery.readerTypeId = request.readerTypeId;
  }
  if (request.civilServantId) {
    readerQuery.civilServantId = request.civilServantId;
  }

  const reminds = await ReaderSchema.findAll({
    where: readerQuery, include: [{
      model: BorrowSchema, attributes: [], required: true,
      include: [{ model: RemindSchema, attributes: [], required: true }]
    }], attributes: ['id', 'fullName', 'studentId', 'civilServantId', [sequelize.fn('COUNT', sequelize.col('*')), 'total']],
    order: [["id", "DESC"]],
    group: ['readers.id', 'readers.full_name', 'readers.student_id', 'readers.civil_servant_id'],
  });
  let remindJSON = reminds.map((remind) => remind.toJSON());
  return remindJSON;
}