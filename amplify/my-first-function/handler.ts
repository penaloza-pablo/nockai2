export const handler = async (event: any) => {
    // Manejo de preflight (OPTIONS)
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Reemplaza con tu dominio en producción
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: '',
      };
    }
  
    // Respuesta normal
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Reemplaza con tu dominio en producción
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Hello from my first function!' }),
    };
  };
  