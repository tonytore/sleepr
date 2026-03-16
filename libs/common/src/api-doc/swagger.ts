import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import basicAuth from 'express-basic-auth';

import type { INestApplication } from '@nestjs/common';

/**
 * Creates the API documentation
 * @param app - The NestJS application
 * @param swaggerUser - The username for the API documentation
 * @param swaggerPassword - The password for the API documentation
 */
export function createDocument(
  app: INestApplication,
  swaggerUser: string,
  swaggerPassword: string,
) {
  const config = new DocumentBuilder()
    .setOpenAPIVersion('3.1.0')
    .setTitle('PSCMS - API Documentation')
    .setDescription(
      `The PSCMS API provides a set of RESTful endpoints that enable clients to interact with the PSCMS System. It is designed to be secure, scalable, and easy to integrate, supporting modern frontend and mobile applications. The API follows REST principles, uses JSON for request and response payloads.`,
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .addSecurityRequirements('bearer')
    .addSecurityRequirements('cookie')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api-docs',
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
    }),
    apiReference({
      content: document,
      theme: 'kepler',
      layout: 'classic',
      hideModels: true,
      showDeveloperTools: 'never',
      expandAllModelSections: true,
      hideTestRequestButton: false,
      hideDarkModeToggle: false,
      persistAuth: true,
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'axios',
      },
      authentication: {
        preferredSecurityScheme: 'bearer',
      },
      // @ts-expect-error - Scalar core supports withCredentials but typings are missing it
      withCredentials: true,
    }),
  );
}
