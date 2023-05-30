import {BotNickNameEnum, PoeClient, sleep} from "../src/PoeClient";

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\history.js > history.log

const client = new PoeClient({logLevel: 'debug'});
await client.init()

await getHistory();
async function getHistory() {
    console.log(`sleeping...`)
    await sleep(5000)
    let history = await client.getHistory(BotNickNameEnum.capybara, 50);
    console.log(`history: \n`, JSON.stringify(history))
}
