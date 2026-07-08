import 'dotenv/config';  // ✅ YE SABSE PEHLE ANA CHAHIYE
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Debug
console.log('ENV Check:', {
  url: process.env.SUPABASE_URL ? '✅' : '❌',
  key: process.env.SUPABASE_KEY ? '✅' : '❌'
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
}
bootstrap();