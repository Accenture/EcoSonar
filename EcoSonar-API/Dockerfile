# See : https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
FROM node:16-slim

# Uncomment if you need to configure proxy. 
# You can init these variables by using --build-args during docker build
# Example : docker build [...] --build-args http_proxy=http://<user>:<password>@<host>:<port>
#ENV HTTP_PROXY=$http_proxy
#ENV HTTPS_PROXY=$https_proxy
#ENV NO_PROXY=$no_proxy

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg \
    fonts-kacst fonts-freefont-ttf libxss1 gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
    libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget\
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Uncomment if you need to configure proxy. 
#RUN npm config set proxy $HTTP_PROXY 

# If you are building your code for production
# RUN npm ci --only=production
# otherwise run npm install
RUN npm install \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app/

USER pptruser

# To avoid "Error: ENOENT: no such file or directory, open '/app/dist/bundle.js'"
RUN npm i

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start" ]