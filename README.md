## AWS Amplify React+Vite Starter Template

This repository provides a starter template for creating applications using React+Vite and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Desarrollo Local

Para desarrollo local con AWS Amplify Gen2, necesitas ejecutar el sandbox de Amplify para crear los recursos de AWS (Cognito, AppSync, etc.) en tu cuenta de AWS.

### Pasos para desarrollo local:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar el sandbox de Amplify (en una terminal separada):**
   ```bash
   npm run sandbox
   ```
   
   Este comando creará los recursos de AWS necesarios y actualizará el archivo `amplify_outputs.json` con los valores reales.

3. **En otra terminal, ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

**Nota importante:** El sandbox debe estar ejecutándose mientras desarrollas. Si detienes el sandbox, los recursos se eliminarán y necesitarás ejecutarlo nuevamente.

### Solución de problemas

Si obtienes el error "User pool client placeholder does not exist":
- Asegúrate de que el sandbox esté ejecutándose (`npm run sandbox`)
- Verifica que el archivo `amplify_outputs.json` no contenga valores "placeholder"
- El sandbox puede tardar unos minutos en crear todos los recursos

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.