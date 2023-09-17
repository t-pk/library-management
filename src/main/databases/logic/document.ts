import { DocumentSchema } from "../db";

export const getDocuments = async (request: any) => {
  try {

    let query: any = {};
    if (request.name) query.name = request.name;
    if (request.id) query.id = request.id;
    if (request.type) query.type = request.type;

    return await DocumentSchema.findAll({ where: query });    
  } catch (error) {
    console.log("getDocuments", error);
  }
}