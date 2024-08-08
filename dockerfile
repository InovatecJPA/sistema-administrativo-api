# docker build -t sistema_administrativo_api .

FROM node:22.5.1

WORKDIR /app

COPY package* .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]