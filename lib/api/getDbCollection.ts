import clientPromise from '@lib/db'
import getEnvVar from '@lib/getEnvVar'

const dbName = getEnvVar('MONGODB_DB_NAME')

/**
 * Grabs the database connection and returns a collection.
 * @param collectionName The collection to return.
 * @returns Returns a collection that can be queried, etc.
 */
const getDbCollection = async (collectionName: string) => {
  /** Get the DB connection. */
  const client = await clientPromise
  const db = await client.db(dbName)

  /** Return the collection. */
  return db.collection(collectionName)
}

export default getDbCollection
