import { ReaderSchema, ReaderTypeSchema, unitOfWork } from '../db';
import { Op } from 'sequelize';

export const createReader = async (request: any) => {
  return unitOfWork(async (transaction: any) => {
    if (request.id) {
      await ReaderSchema.update(request, { where: { id: request.id }, returning: true });
      return request;
    }
    const reader = await ReaderSchema.create(request, { transaction, returning: true, raw: true });
    return reader.dataValues;
  });
};

export const getReaders = async (request: any) => {
    let query: any = {};
    if (request.id) query.id = request.id;

    if (request.fullName) query.fullName = { [Op.iLike]: '%' + request.fullName + '%' };

    if (request.readerTypeId) query.readerTypeId = request.readerTypeId;

    if (request.studentId) query.studentId = { [Op.substring]: request.studentId };

    if (request.civilServantId) query.civilServantId = { [Op.substring]: request.civilServantId };

    if (request.citizenIdentify) query.citizenIdentify = { [Op.substring]: request.citizenIdentify };

    if (request.phoneNumber) query.phoneNumber = { [Op.substring]: request.phoneNumber };

    if (request.email) query.email = { [Op.substring]: request.email };

    const readers = await ReaderSchema.findAll({
      where: query,
      include: [{ model: ReaderTypeSchema }],
      order: [['id', 'ASC']],
    });
    const readersJSON = readers.map((reader) => reader.toJSON());
    return readersJSON;
};
