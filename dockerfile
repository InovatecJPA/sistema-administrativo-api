# docker build -t sistema_administrativo/api .
# docker run -p 3010:3010 -d sistema_administrativo/api
# docker ps
# docker-compose down
# docker-compose up --build

FROM node:22.5.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3010

ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]