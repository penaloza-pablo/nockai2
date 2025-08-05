import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { testFunction } from './function/testFunction/resource';
// import { fetchGuestyBookings } from './function/fetchGuestyBookings/resource';

defineBackend({
  auth,
  data,
  testFunction,
  // fetchGuestyBookings,
});
