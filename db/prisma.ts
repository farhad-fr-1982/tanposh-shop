import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          // تبدیل price به string (اختیاری، بسته به نیاز UI)
          return product.price.toString();
        },
      },
      rating: {
        // اینجا rating که از نوع Decimal است را به number تبدیل می‌کنیم
        needs: { rating: true },
        compute(product) {
          return product.rating.toNumber();
        },
      },
    },
  },
});