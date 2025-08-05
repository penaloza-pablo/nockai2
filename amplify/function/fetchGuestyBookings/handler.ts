import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const client = generateClient<Schema>();
const ssmClient = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });

interface GuestyBooking {
  _id: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface ExpectedUsageItem {
  bookingId: string;
  guestCount: number;
  wine: number;
  water: number;
  coffeeCapsules: number;
  checkIn: string;
  checkOut: string;
}

export const handler = async (event: any) => {
  try {
    const { startDate, endDate } = JSON.parse(event.body);
    
    // Fetch bookings from Guesty API
    const bookings = await fetchGuestyBookings(startDate, endDate);
    
    // Process bookings and calculate expected usage
    const expectedUsageItems: ExpectedUsageItem[] = bookings.map((booking: GuestyBooking) => ({
      bookingId: booking._id,
      guestCount: booking.guests,
      wine: 1, // 1 wine per booking
      water: booking.guests, // 1 water per guest
      coffeeCapsules: 4, // 4 capsules per booking
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    }));
    
    // Clear existing records and insert new ones
    await clearExistingRecords();
    await insertNewRecords(expectedUsageItems);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        message: 'Bookings processed successfully',
        count: expectedUsageItems.length,
        items: expectedUsageItems,
      }),
    };
  } catch (error) {
    console.error('Error processing bookings:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        error: 'Se produjo un error: imposible conectar con Guesty',
      }),
    };
  }
};

async function fetchGuestyBookings(startDate: string, endDate: string): Promise<GuestyBooking[]> {
  // Get credentials from Parameter Store
  const clientId = await getParameterFromSSM('GUESTY_CLIENT_ID');
  const clientSecret = await getParameterFromSSM('GUESTY_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('GUESTY_CLIENT_ID and GUESTY_CLIENT_SECRET must be configured in Parameter Store');
  }
  
  // First, get the Bearer token using OAuth 2.0
  const tokenResponse = await fetch('https://open-api.guesty.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  
  if (!tokenResponse.ok) {
    throw new Error(`Failed to get access token: ${tokenResponse.status}`);
  }
  
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  
  if (!accessToken) {
    throw new Error('No access token received from Guesty');
  }
  
  // Now fetch bookings using the Bearer token
  const response = await fetch('https://open-api.guesty.com/v1/reservations', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Guesty API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Filter bookings by date range and status
  const bookings = data.results || [];
  return bookings.filter((booking: any) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkIn >= start && checkOut <= end && booking.status === 'confirmed';
  });
}

async function clearExistingRecords() {
  try {
    const { data: existingRecords } = await client.models.ExpectedUsage.list();
    
    // Delete all existing records
    for (const record of existingRecords) {
      await client.models.ExpectedUsage.delete({ id: record.id });
    }
  } catch (error) {
    console.error('Error clearing existing records:', error);
  }
}

async function insertNewRecords(items: ExpectedUsageItem[]) {
  for (const item of items) {
    await client.models.ExpectedUsage.create(item);
  }
}

async function getParameterFromSSM(parameterName: string): Promise<string> {
  try {
    // Get the app ID and environment name from environment variables
    const appId = process.env.AMPLIFY_APP_ID;
    const envName = process.env.AMPLIFY_ENV_NAME;
    
    if (!appId || !envName) {
      throw new Error('AMPLIFY_APP_ID and AMPLIFY_ENV_NAME environment variables are required');
    }
    
    // Construct the parameter name following Amplify's convention
    const fullParameterName = `/amplify/${appId}/${envName}/${parameterName}`;
    
    const command = new GetParameterCommand({
      Name: fullParameterName,
      WithDecryption: true, // In case the parameter is encrypted
    });
    
    const response = await ssmClient.send(command);
    return response.Parameter?.Value || '';
  } catch (error) {
    console.error(`Error getting parameter ${parameterName} from SSM:`, error);
    throw new Error(`Failed to get parameter ${parameterName} from Parameter Store`);
  }
} 