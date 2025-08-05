export const handler = async (event: any) => {
    // Headers CORS que siempre se deben incluir
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Manejo de preflight (OPTIONS)
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }
  
    // Respuesta normal
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Hello from my first function!' }),
    };
  };
  