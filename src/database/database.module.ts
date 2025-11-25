import { Module } from '@nestjs/common';
import { DatabaseProvider } from './databaseSource.provider';

@Module({
  imports: [DatabaseProvider],
  exports: [DatabaseProvider]
})
export class DatabaseModule {}
