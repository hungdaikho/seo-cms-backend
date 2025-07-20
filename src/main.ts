import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('RankTracker Pro API')
    .setDescription(`
# RankTracker Pro - SEO Management Platform API

A comprehensive SEO management platform that helps businesses track keyword rankings, 
manage SEO projects, conduct website audits, and monitor competitors.

## Features
- **Multi-tier Subscriptions**: Free, Starter, Professional, Agency plans
- **Keyword Tracking**: Bulk keyword management with ranking history
- **SEO Audits**: Comprehensive website analysis
- **Project Management**: Organize and track multiple SEO projects
- **Usage Limits**: Real-time monitoring based on subscription plans

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
\`Authorization: Bearer <your-jwt-token>\`

## Rate Limiting
API requests are limited based on your subscription plan:
- Free: 10 requests/day
- Starter: 50 requests/day  
- Professional: 200 requests/day
- Agency: 1000 requests/day

## Support
For API support, please contact: support@ranktackerpro.com
    `)
    .setVersion('1.0')
    .setContact(
      'RankTracker Pro Support',
      'https://ranktackerpro.com',
      'support@ranktackerpro.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Development Server')
    .addServer('https://api.ranktackerpro.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration, login, and JWT management')
    .addTag('Users', 'User profile and account management')
    .addTag('Subscriptions', 'Subscription plans, billing, and usage tracking')
    .addTag('Projects', 'SEO project management and organization')
    .addTag('Keywords', 'Keyword tracking and ranking management')
    .addTag('Audits', 'SEO website audits and analysis')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 RankTracker Pro API is running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
