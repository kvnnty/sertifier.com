import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const databaseConfig: MongooseModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('DATABASE_URI'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
  inject: [ConfigService],
};
