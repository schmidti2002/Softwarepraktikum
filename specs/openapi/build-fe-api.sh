#source build-fe-api.sh
export PATH="$(yarn global bin):$PATH"
rm -rf ./out/ts
mkdir -p ./out/ts
cp ./out/ts-build-files/* ./out/ts/
cd ./out/ts
yarn install
yarn run build
cd ../..
