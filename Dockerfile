FROM node:alpine AS easy-share-build

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app

WORKDIR /app
COPY . .
RUN npm run build


FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=easy-share-build /app/dist/easy-share /usr/share/nginx/html
EXPOSE 80 443
