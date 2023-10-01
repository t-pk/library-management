import { ReaderTypeSchema } from '../db';

export const getReaderTypes = async (request: any) => {
  let query: any = {};
  if (request.name) query.name = request.name;
  if (request.id) query.id = request.id;
  return await ReaderTypeSchema.findAll({
    where: query,
    raw: true,
    order: [['id', 'ASC']],
  });
};
