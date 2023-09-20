import { PublisherSchema, unitOfWork } from "../db";
import {Op} from "sequelize";

export const createPublisher = async (request: any) => {
  return unitOfWork((transaction: any) => {
    return PublisherSchema.create(request, { transaction });
  })
}

export const getPublishers = async (request: any) => {
  let query: any = {};
  if (request.id) {
    query.id = request.id;
  }
  if (request.name) {
    query.name = { [Op.iLike]: '%' + request.name + '%' };
  }
  return PublisherSchema.findAll({ where: query, raw: true , order:[["id", "DESC"]]});
}