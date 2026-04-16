# Guia de Contribucion — Car Shop Service

Este documento describe en detalle todos los aspectos tecnicos del proyecto y como ponerlo en marcha en un entorno de desarrollo local.

---

## Requisitos Previos

Antes de comenzar, asegurate de tener instaladas las siguientes herramientas:

- **Node.js** (version 18 o superior recomendada)
- **npm** (viene incluido con Node.js)
- **PostgreSQL** (version 14 o superior recomendada)
- **Git** (para clonar el repositorio)

---

## Estructura del Proyecto

```
ProyectoMoviles/
├── App.js                  # Navegacion principal (Stack Navigator)
├── app.json                # Configuracion de la app Expo
├── firebaseConfig.js       # Configuracion de Firebase
├── index.js                # Punto de entrada Expo
├── package.json            # Dependencias del frontend
├── tsconfig.json           # Configuracion de TypeScript
├── .prettierrc             # Configuracion de formateo
├── .gitignore
├── assets/                 # Imagenes y recursos estaticos
├── components/             # Componentes reutilizables
├── screens/                # Pantallas de la aplicacion
├── services/               # Capa de acceso a la API
├── database/
│   └── schema.sql          # Schema completo de PostgreSQL
└── backend/
    ├── server.js           # Servidor Express
    ├── db.js               # Pool de conexion a PostgreSQL
    ├── package.json        # Dependencias del backend
    ├── .env                # Variables de entorno (NO compartir)
    ├── routes/             # Definicion de rutas
    ├── controllers/         # Logica de negocio
    └── node_modules/
```

---

## Configuracion del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/1Mr-Robot/Car-Shop-Service.git
cd ProyectoMoviles
```

### 2. Configurar Variables de Entorno

El proyecto utiliza variables de entorno para almacenar credenciales sensibles. Necesitas crear los siguientes archivos:

#### Backend — `backend/.env`

Crea el archivo `backend/.env` en la raiz del directorio `backend/` con el siguiente contenido:

```env
PORT=3000
DB_USER=tu_usuario_postgresql
DB_PASSWORD=tu_password_postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carshop_db
```

> **Nota:** No subas este archivo a git. Ya esta ignorado por `.gitignore`, pero asegurate de nunca hacer commit de credenciales reales.

### Frontend — Variables de Entorno de Expo

Expo utiliza el prefijo `EXPO_PUBLIC_` para exponer variables en el cliente. Crea un archivo `.env` en la raiz del proyecto (junto a `package.json`) con:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** Estas variables son accesibles en el bundle de la app. Para proyectos en produccion, utiliza un backend intermedio o reglas de seguridad de Firebase para protegerlas.

### 3. Configurar la Base de Datos PostgreSQL

#### Crear la base de datos

```bash
psql -U tu_usuario -c "CREATE DATABASE carshop_db;"
```

#### Ejecutar el schema

```bash
psql -U tu_usuario -d carshop_db -f database/schema.sql
```

Esto creara todas las tablas, secuencias y relaciones descritas en el modelo de datos.

#### Datos iniciales sugeridos

Puedes insertar datos de prueba en las tablas de catalogos (`rol`, `cliente`, `servicio`, `producto`) para que el sistema funcione. Consulta el archivo `database/schema.sql` para ver la estructura exacta de cada tabla.

### 4. Configurar Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente.
3. En **Authentication**, habilita el metodo **Email/Password**.
4. En **Project Settings**, copia los valores de configuracion a tu archivo `.env` del frontend.
5. Registra al menos un usuario de prueba en **Authentication > Users** para poder iniciar sesion en la app.

---

## Instalacion de Dependencias

### Frontend

Desde la raiz del proyecto:

```bash
npm install
```

### Backend

Desde el directorio `backend/`:

```bash
cd backend
npm install
```

---

## Ejecucion del Proyecto

### 1. Iniciar el Servidor Backend

Abre una terminal en el directorio `backend/` y ejecuta:

```bash
cd backend
npx nodemon server.js -c
```

- `npx nodemon` detecta cambios en los archivos `.js` y reinicia automaticamente el servidor.
- El flag `-c` es para limpiar la pantalla en cada reinicio (estetico).
- El servidor estara disponible en `http://localhost:3000`.
- Para verificar la conexion a la base de datos, visita `http://localhost:3000/api/test`.

### 2. Iniciar el Servidor de Desarrollo Expo

Desde la raiz del proyecto (en una terminal separada):

```bash
npx expo start
```

Esto abrira la interfaz de desarrollo de Expo en el navegador con un codigo QR y opciones para elegir el entorno:

| Tecla | Accion |
|-------|--------|
| `i` | Abrir en simulador de iOS (requiere Xcode en macOS) |
| `a` | Abrir en emulador de Android |
| `w` | Abrir en navegador web |
| `q` | Mostrar codigo QR para Expo Go |

#### Usar Expo Go

1. Descarga **Expo Go** desde la App Store (iOS) o Google Play (Android).
2. Escanea el codigo QR que aparece en la terminal.
3. La app se recargara automaticamente cuando guardes cambios en el codigo.

#### Usar Emulador/Simulador

- **Android:** Usa `adb` para conectar un dispositivo fisico o configura Android Studio como emulador. Presiona `a` en la terminal de Expo.
- **iOS:** Solo disponible en macOS con Xcode instalado. Presiona `i`.

---

## Flujo de Desarrollo

### Agregar una Nueva Pantalla

1. Crea el archivo en `screens/`, por ejemplo `MiPantallaScreen.js`.
2. Implementa el componente usando React Native y los estilos del proyecto.
3. Registra la pantalla en `App.js` agregando un `<Stack.Screen>` dentro del `Stack.Navigator`.
4. Navega a ella desde cualquier otra pantalla usando `navigation.navigate("MiPantalla")`.

### Agregar un Nuevo Endpoint en el Backend

1. Define la ruta en el archivo correspondiente de `routes/`, por ejemplo `routes/miRecursoRoutes.js`.
2. Implementa la logica del controlador en `controllers/miRecursoController.js`.
3. Registra las nuevas rutas en `server.js` con `app.use("/api/v1/miRecurso", miRecursoRoutes)`.

### Modificar el Schema de la Base de Datos

1. Edita `database/schema.sql` para reflejar los cambios.
2. Vuelve a ejecutar el schema en PostgreSQL:

```bash
psql -U tu_usuario -d carshop_db -f database/schema.sql
```

> **Advertencia:** Esto recreara todas las tablas. Si necesitas hacer cambios incrementales, usa `ALTER TABLE` en lugar de recrear todo.

---

## Convenciones de Codigo

### Frontend (React Native)

- Se usa **Prettier** para formateo automatico (configuracion en `.prettierrc`).
- Los archivos de pantallas van en PascalCase: `OrderDetailsScreen.js`.
- Los componentes van en PascalCase: `OrderCard.js`.
- Los servicios van en PascalCase con el sufijo `Service`: `OrderService.js`.
- Los hooks y utilidades van en camelCase.
- Colores, fuentes y espaciados deben definirse como constantes al final del archivo de cada pantalla para mantener consistencia.

### Backend (Node.js / Express)

- Se usa **CommonJS** (`require`/`module.exports`).
- Rutas RESTful con los metodos HTTP correspondientes (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`).
- Parametros de URL en kebab-case: `:order-id`.
- Query parameters en snake_case: `mecanico_id`, `estatus_servicio`.
- Respuestas consistentes: `{ data, meta }` para exitos (200/201) y `{ error }` para errores.

### Base de Datos (PostgreSQL)

- Nombres de tablas en singular: `usuario`, `orden`, `producto`.
- Llaves primarias con sufijo `_id` referenciadas en las tablas dependientes.
- Timestamps para `fecha_inicio` y `fecha_fin`.
- Check constraints para valores cerrados como `estatus`.

---

## Seguridad

- **Nunca** guardes credenciales reales en archivos committed. Usa `.env` y asegurate de que este en `.gitignore`.
- El `.env` del frontend contiene claves de Firebase. En produccion, restrinje el acceso a la API de Firebase por dominio.
- Todas las rutas del backend (excepto `/api/test`) esperan un token de Firebase en el header `Authorization: Bearer <token>`.
- Valida y sanitiza todas las entradas del usuario antes de usarlas en consultas SQL (el backend usa `pg` con parametros preparados para prevenir SQL injection).

---

## Resumen de Comandos

| Comando | Ubicacion | Descripcion |
|---------|-----------|-------------|
| `npm install` | Raiz | Instalar dependencias del frontend |
| `cd backend && npm install` | Raiz | Instalar dependencias del backend |
| `npx nodemon server.js -c` | `/backend/` | Iniciar servidor backend con auto-reload |
| `npx expo start` | Raiz | Iniciar servidor de desarrollo Expo |
| `psql -U user -d db -f schema.sql` | Consola | Ejecutar/resetear schema de BD |

---

## Resolucion de Problemas Comunes

### `Firebase Auth not initialized`
Asegurate de que `firebaseConfig.js` este exportando correctamente el modulo `app` y que las variables `EXPO_PUBLIC_FIREBASE_*` esten definidas en tu `.env`.

### `Connection refused` al backend desde la app
Verifica que el backend este corriendo en `http://localhost:3000` y que la variable `EXPO_PUBLIC_API_URL` en el `.env` del frontend apunte a esa direccion. En emuladores Android, `localhost` puede no funcionar; usa `10.0.2.2` para Android Studio emulator o la IP de tu maquina para dispositivos reales.

### Error de CORS
El backend ya tiene `cors` configurado en `server.js`. Si tienes problemas, verifica que el origen de la peticion este permitido.

### Modulos no encontrados
Asegurate de haber ejecutado `npm install` tanto en la raiz como en `/backend/`.