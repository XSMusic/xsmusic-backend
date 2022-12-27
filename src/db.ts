import { config } from '@core/config';
import { Logger } from '@services';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
mongoose.Promise = Promise;

export const getUri = async () => {
  if (process.env.NODE_ENV === 'test') {
    mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  } else {
    return config.mongo.uri;
  }
};

export const connectToDB = async (): Promise<void> => {
  try {
    const uri = await getUri();
    mongoose.set('strictQuery', false);
    mongoose.connect(uri, config.mongo.options, () => {
      Logger.info('[DB] MongoDB iniciado');
    });
  } catch (error) {
    Logger.error('No se pudo conectar a MongoDB, revisa .env');
  }
};

export const closeDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

export const clearDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    for (const key in mongoose.connection.collections) {
      const collection = mongoose.connection.collections[key];
      await collection.deleteMany({});
    }
  }
};
