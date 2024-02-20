FROM node:current-bookworm
COPY ./frontend /frontend
COPY ./specs/openapi/openapi.yaml /specs/openapi/openapi.yaml
WORKDIR ./frontend
RUN apt update && apt install -y default-jre
RUN yarn
RUN yarn package

FROM unit:python3.11
EXPOSE 3130
COPY deploy/unit-config.json /docker-entrypoint.d/

COPY backend/requirements.txt /config/requirements.txt
RUN pip3 install -r /config/requirements.txt

COPY --from=0 /frontend/dist/ /www/static/
COPY backend/hello.py /www/hello.py

CMD ["unitd", "--no-daemon", "--control", "0.0.0.0:1234"]
