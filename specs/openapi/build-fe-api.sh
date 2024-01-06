#source build-fe-api.sh
export PATH="$(yarn global bin):$PATH"
rm -rf ./out/ts
mkdir -p ./out/ts
openapi-generator-cli generate -i ./openapi.yaml -g typescript-fetch -o ./out/ts/
cp ./out/ts-build-files/* ./out/ts/
cd ./out/ts
yarn install
yarn webpack build
cd ../..
