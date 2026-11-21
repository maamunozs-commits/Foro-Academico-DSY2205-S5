# Despliegue en Oracle Cloud

## Preparar la base

1. Provisiona Autonomous Database en la región principal de tu cuenta. Descarga y descomprime el wallet en una carpeta privada, accesible solo para la persona que administra el despliegue y para el usuario de los contenedores.
2. Con SQLcl, entra al servicio de la base con una cuenta administradora. Ejecuta `scripts/00_crear_esquemas_nube.sql` con las claves de `MM_USUARIOS` y `MM_FORO`.
3. Conéctate como `MM_USUARIOS` y ejecuta `scripts/01_usuarios.sql`. Conéctate como `MM_FORO` y ejecuta `scripts/02_foro.sql` y `scripts/04_moderacion.sql`.
4. Antes de dar acceso público, inicia sesión como `MM_USUARIOS` y ejecuta `scripts/05_reemplazar_claves_demostracion.sql` pasando tres hashes BCrypt distintos de contraseñas de la evaluación. El orden es administrador, moderador y usuario. Conserva las contraseñas fuera del repositorio.

El JDBC Thin usa el alias TNS del wallet. Por ejemplo, `jdbc:oracle:thin:@foro_low?TNS_ADMIN=/run/oracle-wallet`. El directorio montado debe contener `tnsnames.ora`, `sqlnet.ora` y los archivos de confianza descargados.

## Iniciar el entorno

En una VM con Docker Compose, apunta un dominio al servidor y permite los puertos TCP 80 y 443. Copia `.env.nube.ejemplo` a `.env.nube` dentro de `sistema-foros-en-linea`. Configura el alias, las credenciales de los esquemas, la ruta del wallet, JWT y el dominio.

```shell
docker compose --env-file .env.nube -f compose.nube.yml config --quiet
docker compose --env-file .env.nube -f compose.nube.yml up -d --build
docker compose --env-file .env.nube -f compose.nube.yml ps
```

Caddy publica HTTPS. Nginx entrega Angular y dirige las rutas REST al servicio correcto. Los puertos de Spring Boot y Oracle permanecen en redes privadas. Para comprobar la configuración, abre la URL HTTPS en el navegador y consulta `/api/categorias`. Usa las rutas `/api/sesiones`, `/api/temas` y `/api/moderacion/temas` de ese mismo dominio para comprobar los servicios.

Las solicitudes directas a los tres puertos de la colección local corresponden al entorno Docker de evaluación. Para una instancia publicada, los tres valores `url_usuarios`, `url_foro` y `url_moderacion` apuntan a la misma URL pública. Adapta las solicitudes de `health` a las comprobaciones internas de la VM y las credenciales de demostración a las del entorno cloud.

[Documentación de Oracle para JDBC Thin con wallet](https://docs.oracle.com/en-us/iaas/autonomous-database/serverless/adbsb/connect-jdbc-thin-wallet.html)
