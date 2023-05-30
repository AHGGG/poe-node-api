import {PoeClient} from "../src/PoeClient";

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\getAllInfo.js > getAllInfo.log
// open .env file, needed params(buildId / chatId / id etc.) will write to .env file
const options = {logLevel: 'debug'}
const client = new PoeClient(options);
await client.init()

await client.updateAllBotInfo()
