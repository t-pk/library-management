import { AuthorSchema, unitOfWork } from "../db";
import {Op} from "sequelize";

export const createAuthor = async (request: any) => {
  return unitOfWork((transaction: any) => {
    return AuthorSchema.create(request, { transaction });
  })
}

export const getAuthors = async (request: any) => {
  let query: any = {};
  if (request.id) {
    query.id = request.id;
  }
  if (request.name) {
    query.name = { [Op.iLike]: '%' + request.name + '%' };
  }
  return AuthorSchema.findAll({ where: query, raw: true , order:[["id", "ASC"]]});
}