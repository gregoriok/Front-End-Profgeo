# Estágio 1: Build da aplicação React
FROM node:18-alpine as build

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte e gera o build de produção
COPY . .

ARG VITE_GEOSERVER_URL=/geoserver
ENV VITE_GEOSERVER_URL=$VITE_GEOSERVER_URL

RUN npm run build

# Estágio 2: Servidor Nginx para rodar o site
FROM nginx:alpine

# Copia o arquivo de configuração do Nginx que criamos acima
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no estágio de build para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]