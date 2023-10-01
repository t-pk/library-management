import { Transaction } from "sequelize";
import { DocumentTypeSchema, unitOfWork } from "../db";

export const documentTypeSeeds = [
	{
		"id" : 1,
		"name" : "Sách",
		"status" : true,
		"createdAt" : "2023-09-28T02:27:12.307Z",
		"updatedAt" : "2023-09-28T02:27:12.307Z"
	},
	{
		"id" : 2,
		"name" : "Tạp Chí",
		"status" : true,
		"createdAt" : "2023-09-28T02:27:24.734Z",
		"updatedAt" : "2023-09-28T02:27:24.734Z"
	},
	{
		"id" : 3,
		"name" : "Nhật Kí",
		"status" : true,
		"createdAt" : "2023-09-20T16:45:00.000Z",
		"updatedAt" : "2023-09-20T16:45:00.000Z"
	},
	{
		"id" : 4,
		"name" : "Tiểu Thuyết",
		"status" : true,
		"createdAt" : "2023-09-20T18:15:00.000Z",
		"updatedAt" : "2023-09-20T18:15:00.000Z"
	},
	{
		"id" : 5,
		"name" : "Hồi Ký",
		"status" : true,
		"createdAt" : "2023-09-20T19:20:00.000Z",
		"updatedAt" : "2023-09-20T19:20:00.000Z"
	},
	{
		"id" : 6,
		"name" : "Văn Bản",
		"status" : true,
		"createdAt" : "2023-09-20T20:30:00.000Z",
		"updatedAt" : "2023-09-20T20:30:00.000Z"
	},
	{
		"id" : 7,
		"name" : "Bản Vẽ Thiết Kế",
		"status" : true,
		"createdAt" : "2023-09-20T21:45:00.000Z",
		"updatedAt" : "2023-09-20T21:45:00.000Z"
	},
	{
		"id" : 8,
		"name" : "Công Trình Nghiên Cứu",
		"status" : true,
		"createdAt" : "2023-09-20T22:55:00.000Z",
		"updatedAt" : "2023-09-20T22:55:00.000Z"
	},
	{
		"id" : 9,
		"name" : "Dự án",
		"status" : true,
		"createdAt" : "2023-09-20T23:10:00.000Z",
		"updatedAt" : "2023-09-20T23:10:00.000Z"
	},
	{
		"id" : 10,
		"name" : "Bút Tích",
		"status" : true,
		"createdAt" : "2023-09-21T00:25:00.000Z",
		"updatedAt" : "2023-09-21T00:25:00.000Z"
	}
];

export const createDocumentTypes = (data: any) => {
  return unitOfWork((transaction: Transaction) => {
    return DocumentTypeSchema.bulkCreate(data, { transaction });
  })
}
