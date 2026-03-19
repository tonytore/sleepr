import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiReservation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new reservation',
      description:
        'Creates a reservation for a user with a specific place and invoice',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Reservation created successfully',
      example: {
        id: '01KHM0BP8F4TVNYD8JJMPSB05K',
        startDate: '2026-03-18T10:00:00.000Z',
        endDate: '2026-03-20T10:00:00.000Z',
        placeId: 'place_12345',
        invoiceId: 'invoice_67890',
        userId: 'user_abc123',
        createdAt: '2026-03-18T09:55:39.663Z',
        updatedAt: '2026-03-18T09:55:39.663Z',
        deletedAt: null,
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description:
        'Reservation conflict (e.g., overlapping dates or duplicate booking)',
      example: {
        message: 'Reservation conflict',
        error: 'The selected date range is already booked',
        statusCode: 409,
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error',
      example: {
        message: [
          'startDate must be a valid date',
          'endDate must be after startDate',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    }),
  );
}
