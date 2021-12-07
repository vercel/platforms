// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  console.log('Production: Created DB connection.');
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
    console.log('Development: Created DB connection.');
  }
  prisma = global.prisma
}

export default prisma