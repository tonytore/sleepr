import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';
import * as UAParser from 'ua-parser-js';

export interface ClientInfo {
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  clientType?: 'web' | 'mobile' | 'microservice';
}

/**
 * Extract client information from request. It extracts the IP address, user agent, browser, OS, and device type from the current requester client.
 * @param request
 * @returns
 */
function extractClientInfo(request: Request): ClientInfo {
  const forwarded = request.headers['x-forwarded-for'];

  let ip: string;

  if (Array.isArray(forwarded)) {
    ip = forwarded[0];
  } else if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0].trim();
  } else {
    ip = request.socket?.remoteAddress ?? 'unknown';
  }

  const userAgent = request.headers['user-agent'] || 'unknown';

  const parser = new UAParser.UAParser(userAgent);
  const result = parser.getResult();

  // Determine client type
  let clientType: 'web' | 'mobile' | 'microservice' = 'web'; // default
  if (result.device.type === 'mobile') {
    clientType = 'mobile';
  } else if (result.device.type === 'console') {
    clientType = 'microservice';
  }

  return {
    ip,
    userAgent,
    browser: result.browser.name || 'unknown',
    os: result.os.name || 'unknown',
    device: result.device.type || 'desktop',
    clientType,
  };
}

/**
 * ClientInfo - Extract client information from request. It extracts the IP address, user agent, browser, OS, and device type from the current requester client.
 * @returns ClientInfo
 */
export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientInfo => {
    const request: Request = ctx.switchToHttp().getRequest();
    return extractClientInfo(request);
  },
);
