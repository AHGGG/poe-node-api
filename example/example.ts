import {PoeClient, sleep} from "../src/PoeClient";

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\example.js > example.log
let client = new PoeClient({logLevel: 'debug'});
await client.init()

// await sendMsg()
// async function sendMsg() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     await client.sendMessage("Ping", BotNickNameEnum.capybara, false, (result: string) => {
//         console.log(`${result}`)
//     })
//     console.log(`msg sended!`)
// }

// await addChatBreak()
// async function addChatBreak() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     let res = await client.addChatBreak(BotNickNameEnum.capybara);
//     console.log(`res:`, JSON.stringify(res))
// }

// await deleteMessage()
// async function deleteMessage() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     let res = await client.deleteMessage([466627947]);
//     console.log(`res:`, JSON.stringify(res))
// }

await purgeAllMessage()
async function purgeAllMessage() {
    console.log(`sleeping...`)
    await sleep(2000)
    let res = await client.purgeAllMessage();
    console.log(`res:`, JSON.stringify(res))
}

// await getHistory();
// async function getHistory() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     let history = await client.getHistory(BotNickNameEnum.capybara, 50);
//     console.log(`history: \n`, JSON.stringify(history))
// }

// async function getBotInfo() {
//     await sleep(2000)
//     const botInfo = await client.getBot(BotNickNameEnum.capybara);
//     console.log(`botInfo: `, JSON.stringify(botInfo, null, 2))
// }

// ============================= update all env test =============================
// await updateEnvTest()
// async function updateEnvTest() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     await client.updateAllBotInfo()
// }
