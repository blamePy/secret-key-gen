# Usar una imagen base de Node.js con Oracle Client y Oracle Instant Client
FROM node:14

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./
COPY app.js .
COPY index.html .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 8010

# Comando para ejecutar la aplicación
CMD [ "node", "app.js" ]
