# Foro Académico

**Matias Muñoz** · Ingeniería en Desarrollo de Software · Duoc UC

**Desarrollo Full Stack III (DSY2205)** · Experiencia 2 · Semana 5

Foro de discusión sobre Programación, Bases de datos, Desarrollo web, Ciberseguridad e Inteligencia artificial. La interfaz Angular trabaja de forma independiente con colecciones locales. Las API REST de Usuarios, Foro y Moderación se verifican con Postman sobre una base Oracle.

## Accesos

| Entorno | Acceso |
| --- | --- |
| Interfaz pública | [Foro Académico en GitHub Pages](https://maamunozs-commits.github.io/Foro-Academico-DSY2205-S5/) |
| Interfaz en Docker | `http://localhost:8080` |
| Servicios Spring Boot | Usuarios `8081`, Foro `8082`, Moderación `8083` |
| Oracle Database Free | `localhost:1522/FREEPDB1` |

## Código fuente

| Carpeta | Contenido |
| --- | --- |
| `frontend` | Angular 21 con Bootstrap. Componentes separados para cuenta, foro y moderación. |
| `sistema-foros-en-linea/servicio-usuarios` | Registro, autenticación, gestión de cuentas y asignación de roles. |
| `sistema-foros-en-linea/servicio-foro` | Categorías, búsqueda, temas, comentarios y persistencia de las decisiones de moderación. |
| `sistema-foros-en-linea/servicio-moderacion` | Cola de temas y comentarios, ocultamiento y restitución autorizados mediante JWT. |
| `sistema-foros-en-linea/nucleo-comun` | Seguridad compartida, contratos y manejo de errores. |
| `scripts` | Esquemas, tablas, datos iniciales, migración de moderación y consultas de verificación. |
| `arquetipo-servicio` | Plantilla Maven para generar un microservicio con controlador, servicio y DTO. |

## Ejecutar en Docker Desktop

Desde la raíz del repositorio en PowerShell:

```powershell
Set-Location sistema-foros-en-linea
Copy-Item .env.ejemplo .env
```

Edita `.env` con las claves locales de Oracle y un secreto JWT aleatorio de al menos 32 bytes. Luego inicia los contenedores.

```powershell
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8081/actuator/health
Invoke-RestMethod http://localhost:8082/actuator/health
Invoke-RestMethod http://localhost:8083/actuator/health
```

Abre `http://localhost:8080`. La portada cambia de una columna en móvil a dos en tableta y tres en escritorio. En **Ingresar** puedes rellenar una cuenta de demostración para probar como usuario o administrador. Usa **Moderación** con la cuenta de administrador para ocultar o restituir contenido.

Los cambios de Angular se guardan en el navegador. El flujo de recuperación utiliza un código de demostración generado en la misma interfaz. Las operaciones que ejecutes en Postman utilizan los datos de Oracle de forma independiente.

## Verificación de las API

Importa la colección `Foro_academico.postman_collection.json` y el entorno `Foro_local.postman_environment.json` desde `sistema-foros-en-linea/postman`. Selecciona **Foro Académico Semana 5 local** y ejecuta la colección de principio a fin sobre el entorno de evaluación.

```powershell
npx --yes --package newman@6 newman run postman/Foro_academico.postman_collection.json -e postman/Foro_local.postman_environment.json
```

La colección ejecuta 58 solicitudes y 74 comprobaciones. Incluye pruebas de autorización, persistencia, ocultamiento y restitución. Crea y elimina registros temporales como parte del recorrido.

## Arquetipo Maven

Con Java 21 y Maven, desde la raíz del repositorio:

```shell
mvn -f arquetipo-servicio/pom.xml install
mvn org.apache.maven.plugins:maven-archetype-plugin:3.4.1:generate -DarchetypeGroupId=cl.matiasmunoz -DarchetypeArtifactId=arquetipo-servicio -DarchetypeVersion=1.0.0 -DgroupId=cl.matiasmunoz.ejemplo -DartifactId=servicio-ejemplo -Dpackage=cl.matiasmunoz.ejemplo -Dversion=1.0.0 -DinteractiveMode=false
```

El proyecto generado expone `GET /api/estado` y `GET /actuator/health`.

## Configuración de Oracle Cloud

El manifiesto `sistema-foros-en-linea/compose.nube.yml` utiliza una base Oracle externa, TLS administrado por Caddy y un volumen de solo lectura para el wallet. Los esquemas, el wallet y el dominio se configuran en la cuenta de Oracle Cloud. Consulta [la preparación del entorno de nube](sistema-foros-en-linea/DESPLIEGUE_NUBE.md).
