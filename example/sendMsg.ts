import {BotNickNameEnum, PoeClient, sleep} from "../src/PoeClient";

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\sendMsg.js > sendMsg.log

const client = new PoeClient({debug: true});
await client.init()

await sendMsg()
async function sendMsg() {
    console.log(`sleeping...`)
    await sleep(2000)
    await client.sendMessage("Ping", BotNickNameEnum.capybara, false, (result: string) => {
        console.log(`${result}`)
    })
    console.log(`msg sended!`)
}

// await clear()
// async function clear() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     await client.clearContext(BotNickNameEnum.capybara);
// }
