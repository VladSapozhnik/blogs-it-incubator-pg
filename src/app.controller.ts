import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}
  @Get()
  getHello(): string {
    return 'Main Page';
  }

  // @Delete('testing/all-data')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteAll() {
  //   const collections = await this.databaseConnection.listCollections();
  //
  //   const promises = collections.map((collection) =>
  //     this.databaseConnection.collection(collection.name).deleteMany({}),
  //   );
  //   await Promise.all(promises);
  // }
}
