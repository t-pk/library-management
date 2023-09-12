
export const testQuery = async(sequelize: any) => {
  const result = await sequelize.query('select id from users');
  console.log("scueess tested");
  return result;
}