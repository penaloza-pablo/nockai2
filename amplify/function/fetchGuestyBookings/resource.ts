import { defineFunction } from '@aws-amplify/backend';

export const fetchGuestyBookings = defineFunction({
  name: 'fetchGuestyBookings',
  entry: './handler.ts',
}); 