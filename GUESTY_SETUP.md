# Configuración de Integración con Guesty

## Pasos para configurar la integración con Guesty API:

### 1. Obtener credenciales de Guesty
1. Inicia sesión en tu cuenta de Guesty
2. Ve a Settings > API
3. Genera una nueva aplicación OAuth 2.0
4. Copia el **Client ID** y **Client Secret** generados

**Nota importante:**
Según la documentación de Guesty, necesitas usar OAuth 2.0 para obtener un Bearer token:
- **Client ID**: Tu identificador de aplicación
- **Client Secret**: Tu secreto de aplicación

El flujo es: Client ID + Client Secret → Bearer Token → Acceso a la API

### 2. Configurar las variables de entorno
Una vez que tengas el Client ID y Client Secret de Guesty, necesitas configurarlos como variables de entorno:

**Opción A: Usando variables de entorno del sistema**
```bash
# En tu terminal, ejecuta:
export GUESTY_CLIENT_ID=tu_client_id_aqui
export GUESTY_CLIENT_SECRET=tu_client_secret_aqui
```

**Opción B: Crear archivo .env en la raíz del proyecto**
```bash
# Crea un archivo .env en la raíz del proyecto con:
GUESTY_CLIENT_ID=tu_client_id_aqui
GUESTY_CLIENT_SECRET=tu_client_secret_aqui
```

**Opción C: Configurar en AWS Systems Manager Parameter Store (Recomendado)**
```bash
# 1. Instala la dependencia necesaria
npm install @aws-sdk/client-ssm

# 2. Configura las variables de entorno temporalmente
export GUESTY_CLIENT_ID=tu_client_id_aqui
export GUESTY_CLIENT_SECRET=tu_client_secret_aqui

# 3. Ejecuta el script de configuración
node setup-parameters.js

# 4. Limpia las variables de entorno por seguridad
unset GUESTY_CLIENT_ID
unset GUESTY_CLIENT_SECRET
```

**Configuración manual en AWS Console:**
1. Ve a AWS Systems Manager > Parameter Store
2. Crea un parámetro llamado `/amplify/{appId}/{envName}/GUESTY_CLIENT_ID`
3. Crea un parámetro llamado `/amplify/{appId}/{envName}/GUESTY_CLIENT_SECRET`
4. Establece el tipo como "SecureString" para encriptar los valores
5. Establece los valores correspondientes

### 3. Desplegar el backend
```bash
# Despliega el backend (las credenciales se leerán desde Parameter Store)
amplify push
```

**Nota:** Si usas Parameter Store, no necesitas configurar variables de entorno locales.

### 4. Verificar la configuración
- La función Lambda `fetchGuestyBookings` se creará automáticamente
- La tabla `ExpectedUsage` se creará en DynamoDB
- Los parámetros se configurarán en AWS Systems Manager Parameter Store
- La Lambda tendrá permisos para leer los parámetros de Parameter Store

### 5. Permisos IAM (Automático)
Amplify configurará automáticamente los permisos IAM necesarios para que la Lambda pueda:
- Leer parámetros de Systems Manager Parameter Store
- Acceder a DynamoDB para la tabla ExpectedUsage

## Uso de la funcionalidad:

1. **Acceder a Expected Usage**: Haz clic en la tarjeta "Expected Usage" en la página de Inventory
2. **Obtener datos de Guesty**: Haz clic en el botón "Get from Guesty"
3. **Ver resultados**: Los datos se mostrarán en la tabla con los cálculos automáticos:
   - 1 Wine por reserva
   - 1 Water por persona
   - 4 Coffee Capsules por reserva

## Notas importantes:

- La función obtiene reservas desde la fecha del último "Last update submit" hasta hoy
- Solo se procesan reservas con estado "confirmed"
- Los datos existentes se sobrescriben cada vez que se ejecuta la función
- El contador en la tarjeta se actualiza automáticamente con el número real de reservas

## Solución de problemas:

Si encuentras el error "Se produjo un error: imposible conectar con Guesty":
1. Verifica que el Client ID y Client Secret estén configurados correctamente
2. Asegúrate de que la aplicación OAuth tenga permisos para leer reservas
3. Verifica que tu cuenta de Guesty esté activa
4. Revisa los logs de la función Lambda en AWS Console
5. Confirma que el flujo OAuth 2.0 esté funcionando correctamente 