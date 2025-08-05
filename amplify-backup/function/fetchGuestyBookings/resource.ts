import { defineFunction } from '@aws-amplify/backend';

export const fetchGuestyBookings = defineFunction({
  name: 'fetchGuestyBookings',
  entry: './handler.ts',
  environment: {
    // These will be set automatically by Amplify
    AMPLIFY_APP_ID: process.env.AMPLIFY_APP_ID || '',
    AMPLIFY_ENV_NAME: process.env.AMPLIFY_ENV_NAME || '',
  },
}); 