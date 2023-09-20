import { DocumentTypeSchema } from "../db";

export const getDocumentTypes = async (request: any) => {
  try {

    let query: any = {};
    if (request.name) query.name = request.name;
    if (request.id) query.id = request.id;

    return await DocumentTypeSchema.findAll({ where: query, raw: true, order:[["id", "ASC"]] });    
  } catch (error) {
    console.log("getDocumentTypes", error);
  }
}