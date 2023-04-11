const getDbName = () => {
  const dbName = process.env.MONGOD_DB_NAME

  if (dbName === undefined) {
    throw new Error('Invalid / Missing environment variable: "MONGOD_DB_NAME"')
  }

  return dbName
}

export default getDbName
