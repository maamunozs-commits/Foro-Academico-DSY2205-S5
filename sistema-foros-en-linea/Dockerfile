FROM maven:3.9-eclipse-temurin-21 AS compilacion
WORKDIR /proyecto
COPY pom.xml .
COPY nucleo-comun nucleo-comun
COPY servicio-usuarios servicio-usuarios
COPY servicio-foro servicio-foro
COPY servicio-moderacion servicio-moderacion
ARG MODULO
RUN --mount=type=cache,target=/root/.m2 mvn -B -pl ${MODULO} -am package -DskipTests
FROM eclipse-temurin:21-jre
WORKDIR /aplicacion
ARG MODULO
COPY --from=compilacion /proyecto/${MODULO}/target/${MODULO}-1.0.0.jar aplicacion.jar
USER 10001:10001
ENTRYPOINT ["java", "-jar", "aplicacion.jar"]
