# Build aşaması
FROM node:16-alpine as build-stage

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Production build
RUN npm run build

# Production aşaması
FROM nginx:stable-alpine as production-stage

# Build çıktısını Nginx'e kopyala
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx yapılandırmasını kopyala
COPY src/deploy/nginx.conf /etc/nginx/nginx.conf

# Port 80'i dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"] 