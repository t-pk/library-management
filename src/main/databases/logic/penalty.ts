
import countBy from "lodash.countby";
import { BorrowSchema, PenaltySchema, ReaderSchema, RemindSchema, ReturnSchema, sequelize, unitOfWork } from "../db";
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

  const penalties = await PenaltySchema.findAll({
    include: [{
      model: ReturnSchema, required: true,
      include: [{
        model: BorrowSchema, required: true,
        include: [{ model: ReaderSchema, required: true, where: readerQuery, }]
      }]
    }],
    order: [["id", "DESC"]],
  });
  let penaltiesJSON = penalties.map((penalty) => penalty.toJSON());
  console.log("penaltiesJSON", penaltiesJSON);
  return penaltiesJSON;
}