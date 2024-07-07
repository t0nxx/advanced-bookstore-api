import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Swagger Documentation Config
   */
  const config = new DocumentBuilder()
    .setTitle('Advanced Bookstore API')
    .setDescription('The Advanced Bookstore API description')
    .setVersion('1.0')
    .addTag('Bookstore')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /**
   *  App GlobalPipes
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  /**
   * helmet
   */
  app.use(helmet());


  await app.listen(3003);
}
bootstrap();
