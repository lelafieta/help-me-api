import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
   constructor() {
    super({
      log: ['error', 'warn'], // se quiser logs
      transactionOptions: {
        maxWait: 10000,
        timeout: 15000,
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from 'generated/prisma';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
// }
