# API Rest de productos

Servicio web como API RESTful para visualizar productos de una base de datos. El servicio funciona como backend de la aplicación móvil [productos-app-flutter](https://github.com/feguedi/productos-app-flutter).

## Variables de entorno

Es necesario declarar las variables de entorno para que el sistema pueda funcionar correctamente. Mientras estemos en un entorno de desarrollo podemos copiar las variables que existen en el archivo `.env.example`:

```bash
$ cp .env.example .env
```

Y sustituir los valores de las variables por los nuestros.

## Instalación

- Para instalar las dependencias en Node:

```bash
$ npm install
```

## Iniciar el servicio

- Para iniciar el servicio como desarrollador usando `nodemon`:

```bash
$ npm run dev
```

- Para iniciar el servicio en producción:

```bash
$ npm start
```
