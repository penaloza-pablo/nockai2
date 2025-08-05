import { SSMClient, PutParameterCommand } from '@aws-sdk/client-ssm';

// Configuration
const appId = process.env.AMPLIFY_APP_ID || 'your-app-id'; // Replace with your actual app ID
const envName = process.env.AMPLIFY_ENV_NAME || 'dev'; // Replace with your environment name
const region = process.env.AWS_REGION || 'us-east-1';

const ssmClient = new SSMClient({ region });

async function setupParameters() {
  const parameters = [
    {
      name: 'GUESTY_CLIENT_ID',
      value: process.env.GUESTY_CLIENT_ID,
      description: 'Guesty OAuth Client ID for API access'
    },
    {
      name: 'GUESTY_CLIENT_SECRET',
      value: process.env.GUESTY_CLIENT_SECRET,
      description: 'Guesty OAuth Client Secret for API access'
    }
  ];

  for (const param of parameters) {
    if (!param.value) {
      console.error(`❌ ${param.name} environment variable is not set`);
      continue;
    }

    try {
      const fullParameterName = `/amplify/${appId}/${envName}/${param.name}`;
      
      const command = new PutParameterCommand({
        Name: fullParameterName,
        Value: param.value,
        Type: 'SecureString', // Encrypt the parameter
        Description: param.description,
        Overwrite: true // Allow overwriting existing parameters
      });

      await ssmClient.send(command);
      console.log(`✅ Successfully created parameter: ${fullParameterName}`);
    } catch (error) {
      console.error(`❌ Error creating parameter ${param.name}:`, error.message);
    }
  }
}

// Run the setup
setupParameters().catch(console.error); 