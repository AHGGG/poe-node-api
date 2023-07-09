import {BotNickNameEnum, PoeClient, sleep} from "../src/PoeClient";

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\sendMsg.js > sendMsg.log 2>&1


// ========================= use env for one account =========================
const client = new PoeClient({logLevel: 'debug'});
await client.init(true)
await sendMsg()
async function sendMsg() {
    console.log(`sleeping...`)
    await sleep(2000)
    await client.sendMessage("Ping", BotNickNameEnum.capybara, true, (result: string) => {
        console.log(`${result}`)
    })
    console.log(`msg sent!`)
}


// ========================= use envMap for multi-account =========================
// console.log(`\n\n============================== Get configurations first ==============================`)
// let cookies = ['p-b=fTCxxx%3D', 'p-b=ZLuSTxxxxxD'];
// const clientMap = new Map<number, PoeClient>()
// const envMap = new Map<number, ProcessEnv>()
//
// for (let i = 0; i < cookies.length; i++) {
//     let cookie = cookies[i];
//     // let uuid = randomUUID();
//
//     const client = new PoeClient({
//         cookie: cookie,
//         env: {}, // pass {"poe-formkey": "xxx", "buildId": "xxx" ......} after fetch them first from client1.init()
//         logLevel: 'debug'
//     });
//     const envMap1 = await client.init(false)
//     console.log(`envMap1:`, JSON.stringify(envMap1, null, 2))
//
//     envMap.set(i, envMap1)
//
//     // store envMap1 somewhere, next time pass envMap1 as env to PoeClient constructor, client will read needed info like buildId from env passed in
//     clientMap.set(i, client)
// }


// console.log(`\n\n============================== get client and chat ==============================`)
// const client1 = clientMap.get(0)!
// // next time pass envMap1 as env to PoeClient constructor, client will read needed info like buildId from env passed in
// await client1.sendMessage("Give me 2 English words.", BotNickNameEnum.capybara, true, (result: string) => {
//     console.log(`${result}`)
// })
// await sleep(2000)
//
// const client2 = clientMap.get(1)!
// await client2.sendMessage("Give me 3 English words.", BotNickNameEnum.capybara, true, (result: string) => {
//     console.log(`${result}`)
// })
// await sleep(2000)


// console.log(`\n\n============================== Continue sendMessage ==============================`)
// await client1.sendMessage("What we are talking about?", BotNickNameEnum.capybara, false, (result: string) => {
//     console.log(`${result}`)
// })
// await sleep(2000)


// console.log(`\n\n============================== Continue sendMessage by client2 ==============================`)
// await client2.sendMessage("What we are talking about?", BotNickNameEnum.capybara, false, (result: string) => {
//     console.log(`${result}`)
// })
// await sleep(2000)


// console.log(`\n\n============================== Next time, Start chat with envMap ==============================`)
// const client3 = new PoeClient({
//     cookie: cookies[0],
//     env: {
//         "poe-formkey": "be6xxxb52a92812",
//         "buildId": "rCiSJxxxxbFAj",
//         "capybara_-_Sage_chatId": "xxxx",
//         "capybara_-_Sage_id": "xxxxx==",
//         "beaver_-_GPT-4_chatId": "xxxxx",
//         "beaver_-_GPT-4_id": "xxxx==",
//         "a2_2_-_Claude_2_chatId": "xxxx",
//         "a2_2_-_Claude_2_id": "xxxx==",
//         "a2_100k_-_Claude-instant-100k_chatId": "xxxx",
//         "a2_100k_-_Claude-instant-100k_id": "xxx==",
//         "a2_-_Claude-instant_chatId": "xxxx",
//         "a2_-_Claude-instant_id": "xxxx==",
//         "chinchilla_-_ChatGPT_chatId": "xxx",
//         "chinchilla_-_ChatGPT_id": "xxxx==",
//         "nutria_-_Dragonfly_chatId": "xxx",
//         "nutria_-_Dragonfly_id": "xxxxxx=="
//     }, // pass env stored from last time, {"poe-formkey": "xxx", "buildId": "xxx" ......}
//     logLevel: 'debug'
// });
// let env3 = await client3.init(false); // env3 is the same as env passed to PoeClient constructor
// console.log(`env3:`, JSON.stringify(env3, null, 2))
// await sleep(2000)
// await client3.sendMessage("What topic we are talking about?", BotNickNameEnum.capybara, false, (result: string) => {
//     console.log(`${result}`)
// })




// await clear()
// async function clear() {
//     console.log(`sleeping...`)
//     await sleep(2000)
//     await client.clearContext(BotNickNameEnum.capybara);
// }
