import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Serve static files (frontend)
  app.useStaticAssets(join(__dirname, '..'));

  // Initialize database
  const databaseService = app.get(DatabaseService);
  await databaseService.initDatabase();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`
╔════════════════════════════════════════════╗
║   🌱 Plant Tracker Server Running!        ║
║        (NestJS + TypeScript)              ║
║                                            ║
║   Local:    http://localhost:${PORT}        ║
║   Network:  http://0.0.0.0:${PORT}          ║
║                                            ║
║   Database: ${join(process.cwd(), 'database.json')}
║                                            ║
║   Ready to accept connections! 🚀          ║
╚════════════════════════════════════════════╝
  `);
}

bootstrap();
