FROM certbot/certbot
COPY run.sh /
COPY deploy.sh /
RUN apk add bash curl
ENTRYPOINT ["bash", "/run.sh"]
