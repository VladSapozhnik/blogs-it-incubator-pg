import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}
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
