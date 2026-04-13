# Menggunakan Node.js versi 22 sesuai syarat Dicoding
FROM node:22-alpine

# Menentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin package.json dan menginstal dependency
COPY package*.json ./
RUN npm install --production

# Menyalin seluruh file proyek
COPY . .

# Membuka port yang digunakan aplikasi
EXPOSE 5000

# Menjalankan aplikasi
CMD ["npm", "start"]