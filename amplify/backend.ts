import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myFirstFunction } from './my-first-function/resource';
// import { fetchGuestyBookings } from './function/fetchGuestyBookings/resource';

defineBackend({
  auth,
  data,
  myFirstFunction,
  // fetchGuestyBookings,
});
