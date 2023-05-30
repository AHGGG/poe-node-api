import fetch from "node-fetch";
import { SocksProxyAgent } from 'socks-proxy-agent'
import http from 'https-proxy-agent'
import {PoeClient} from "../src/PoeClient";
const {HttpsProxyAgent} = http

// Temporary use:
// Move this file to src/
// Terminal run: cp -r graphql dist/
// Terminal run: yarn run build
// Terminal run: node .\dist\proxy.js > proxy.log
// Get your ip in https://ipinfo.io/
// Search x-forwarded-for in proxy.log, and x-forwarded-for is equals to ip get from ipinfo.io

const options = {logLevel: 'debug'}
setupProxy(options, {
    https: {
        proxy: 'http://127.0.0.1:1080' // http://username:password@domain:port
    }
})

await getProxyIpInfoFromIpInfo(options, 'http://127.0.0.1:1080')

const client = new PoeClient(options);
await client.init()

await client.getNextData()
function setupProxy(options: any, proxy: ProxyInfo) {
    if (proxy.socks) {
        const agent = new SocksProxyAgent(`socks://${proxy.socks.host}:${proxy.socks.port}`);
        options.agent = agent;
        options.fetch = (url: string, options: any) => {
            return fetch(url, { agent, ...options })
        }
    }else if (proxy.https) {
        const httpsProxy = proxy.https.allProxy || proxy.https.proxy;
        if (httpsProxy) {
            const agent = new HttpsProxyAgent(httpsProxy);
            options.agent = agent;
            options.fetch = (url: string, options: any) => {
                return fetch(url, { agent, ...options })
            }
        }
    }
}

async function getProxyIpInfoFromIpInfo(options: any, httpsProxy: string) {
    if (httpsProxy) {
        const fetchParam = {
            method: 'GET',
            agent: new HttpsProxyAgent(httpsProxy)
        }
        const r = await options.fetch('https://ipinfo.io/json', fetchParam);
        if (!r.ok) {
            const reason = await r.text()
            const msg = `error ${
                r.status || r.statusText
            }: ${reason}`
            throw new Error(msg)
        }

        let response = await r.json();
        console.log(`ipinfo:`, response)
        return response
    }
}
