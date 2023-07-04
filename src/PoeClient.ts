import { fetch as globalFetch } from './fetch.js'
import WebSocket, {ErrorEvent} from "ws";
import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import pino, {Logger} from "pino";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`__dirname:`, __dirname)
const queries = {
    chatViewQuery: fs.readFileSync(path.join(__dirname, "./graphql/ChatViewQuery.graphql"), {encoding: "utf8"}),
    addMessageBreakMutation: fs.readFileSync(path.join(__dirname, "./graphql/AddMessageBreakMutation.graphql"), {encoding: "utf8"}),
    chatListPaginationQuery: fs.readFileSync(path.join(__dirname, "./graphql/ChatListPaginationQuery.graphql"), {encoding: "utf8"}),
    chatListPaginationQueryPlus: fs.readFileSync(path.join(__dirname, "./graphql/ChatListPaginationQueryPlus.graphql"), {encoding: "utf8"}),
    addHumanMessageMutation: fs.readFileSync(path.join(__dirname, "./graphql/AddHumanMessageMutation.graphql"), {encoding: "utf8"}),
    sendMessageMutation: fs.readFileSync(path.join(__dirname, "./graphql/SendMessageMutation.graphql"), {encoding: "utf8"}),
    deleteMessageMutation: fs.readFileSync(path.join(__dirname, "./graphql/DeleteMessageMutation.graphql"), {encoding: "utf8"}),
};
export enum BotNickNameEnum {
    'a2' = 'a2', // Claude-instant
    'a2_2' = 'a2_2', // Claude+
    'beaver' = 'beaver', // GPT-4
    'capybara' = 'capybara', // Sage
    'nutria' = 'nutria', // Dragonfly
    'chinchilla' = 'chinchilla', // ChatGPT
    'hutia' = 'hutia', // NeevaAI
}
export enum DisplayNameEnum {
    'Claude-instant' = 'Claude-instant',
    'Claude+' = 'Claude+',
    'GPT-4' = 'GPT-4',
    'Sage' = 'Sage',
    'Dragonfly' = 'Dragonfly',
    'ChatGPT' = 'ChatGPT',
    'NeevaAI' = 'NeevaAI',
}

type DisplayNameType = { [key in BotNickNameEnum]: DisplayNameEnum; };

type NickNameType = { [key in DisplayNameEnum]: BotNickNameEnum; }
export const DisplayName: DisplayNameType = {
    [BotNickNameEnum.a2]: DisplayNameEnum["Claude-instant"],
    [BotNickNameEnum.a2_2]: DisplayNameEnum["Claude+"],
    [BotNickNameEnum.beaver]: DisplayNameEnum["GPT-4"],
    [BotNickNameEnum.capybara]: DisplayNameEnum.Sage,
    [BotNickNameEnum.nutria]: DisplayNameEnum.Dragonfly,
    [BotNickNameEnum.chinchilla]: DisplayNameEnum.ChatGPT,
    [BotNickNameEnum.hutia]: DisplayNameEnum.NeevaAI,
}
export const NickName: NickNameType = {
    [DisplayNameEnum["Claude-instant"]]: BotNickNameEnum.a2,
    [DisplayNameEnum['Claude+']]: BotNickNameEnum.a2_2,
    [DisplayNameEnum['GPT-4']]: BotNickNameEnum.beaver,
    [DisplayNameEnum['Sage']]: BotNickNameEnum.capybara,
    [DisplayNameEnum['Dragonfly']]: BotNickNameEnum.nutria,
    [DisplayNameEnum['ChatGPT']]: BotNickNameEnum.chinchilla,
    [DisplayNameEnum['NeevaAI']]: BotNickNameEnum.hutia
}

export class PoeClient{
    private logger: Logger
    // @ts-ignore
    private ws: WebSocket
    private env: ProcessEnv
    private bots: Bots = {}
    private viewer: Viewer = {}
    private nextData: any = {}
    private connected: boolean = false
    private headers : PoeHeaders
    // @ts-ignore
    private tchannelData: TchannelData;
    private nicknames: any = {} // displayName -> nickname
    private displayNames: any = {} // nickname -> displayName
    protected _fetch: FetchFunction = globalFetch
    constructor(opts: PoeClientOptions) {
        const {
            cookie,
            env = process.env,
            logLevel = 'info',
            fetch = globalFetch,
            retry = 5,
            retryMsInterval = 2000
        } = opts

        this.env = env
        this.logger = pino.pino({
            level: logLevel,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: false,
                    ignore: 'hostname,pid'
                }
            }
        });

        if (!this.env) {
            throw new Error('env is undefined, create .env file or pass your local envMap to Client constructor') // TODO: Test empty .env file
        }

        this._fetch = async (url, options) => {
            this.logger.info(options, `fetch: ${url}, options:`)
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i <= retry; ++i) {
                    if (i > 0) {
                        this.logger.info(`retrying ${url}, ${i}/${retry}...${new Date().getSeconds()}`)
                        await sleep(retryMsInterval)
                    }
                    try {
                        const retryRes = await fetch(url, {...options})
                        if (retryRes.ok) {
                            return resolve(retryRes);
                        } else {
                            this.logger.error(`\tfetch failed: ${url}, ${retryRes.status}, ${retryRes.statusText}`)
                            if (+retryRes.status === 400) {
                                this.logger.error(`\t[Note] Make sure you put the correct cookie in .env file, like ===> cookie=p-b=xxxxxxxx. After setting a new cookie, delete other poe's old key-value pairs.`)
                            }
                        }
                    } catch (e){
                        this.logger.error(e)
                    }
                }
                reject(new Error(`Failed to fetch ${url} after ${retry} retries`))
            });
        };
        this.headers = {
            'poe-formkey': this.env["poe-formkey"] || '',
            'poe-tchannel': this.env["poe-tchannel"] || '',
            'cookie': this.env['cookie'] || cookie || '',
        }

        this.setBotId()
        this.logger.debug(this.env, `this.env:`)

        if (!this.headers.cookie) {
            throw new Error('cookie is null');
        }

        if (!this._fetch) {
            throw new Error('Invalid environment; fetch is not defined')
        }

        if (typeof this._fetch !== 'function') {
            throw new Error('Invalid "fetch" is not a function')
        }
    }

    /**
     * Read .env file and set poe-formkey / buildId / botsInfo to memory
     */
    public setBotId() {
        const envMap = Object.keys(this.env).reduce((result, key) => {
            result.set(key, this.env[key]);
            return result;
        }, new Map());

        for (let [envKey, _] of envMap) {
            if (!envKey.includes("_chatId") && !envKey.includes("_id") && !envKey.includes("_-_")) {
                continue
            }
            let localNickname = envKey.split('_-_')[0];
            let displayNameAndID = envKey.split('_-_')[1];// like: GPT-4_chatId
            let localDisplayName = displayNameAndID.substring(0, displayNameAndID.indexOf("_chatId"));
            const botChatIdKey = `${localNickname}_-_${localDisplayName}_chatId`;
            const botIdKey = `${localNickname}_-_${localDisplayName}_id`;
            if(envMap.has(botChatIdKey) && envMap.has(botIdKey)) {
                let chatId = this.env[botChatIdKey];
                let id = this.env[botIdKey];
                if (!chatId || !id) {
                    continue
                }
                this.bots[localNickname] = {
                    chatId: +chatId,
                    id: id
                };
                this.nicknames[localDisplayName] = localNickname;
                this.displayNames[localNickname] = localDisplayName;
                this.logger.debug(`read ${localDisplayName}'s chatId(${this.bots[localNickname]!.chatId}) and id(${this.bots[localNickname]!.id})`)
            }
        }
    }

    /**
     * If !poe-formkey || !buildId || !this.nextData, will updateAllBotInfo and write poe-formkey / buildId / botsInfo to .env file, for next chat use.
     * And get channel info => subscribe => connectWs
     */
    public async init(rewriteToLocalEnvFile: boolean = true): Promise<ProcessEnv>{
        this.nextData.buildId = this.env["buildId"] || undefined
        if (!this.env["poe-formkey"] || !this.nextData.buildId) {
            await this.updateAllBotInfo(rewriteToLocalEnvFile)
        }
        await this.getChannelData() // get poe-tchannel
        await this.subscribe()
        await this.connectWs()
        return Promise.resolve(this.env);
    }

    /**
     * send message to bot
     * @param text user input
     * @param botNickName bot nick name, like capybara(Sage) / a2(Claude-instant) / a2_2(Claude+) etc.
     * @param withChatBreak
     * @param callback
     */
    public async sendMessage(text: string, botNickName: BotNickNameEnum | string, withChatBreak = false, callback = console.log) {
        if (!this.connected) {
            await this.disConnectWs()
            await this.getNextData()
            // await this.getBots()
            await this.subscribe()
            await this.connectWs()
        }
        if (!this.bots[botNickName]?.chatId || !this.bots[botNickName]?.id) {
            const displayName = this.getDisplayName(botNickName)
            if (!displayName) {
                throw new Error(`can not get displayName by botNickName: ${botNickName}`)
            }
            await this.getBotByDisplayName(displayName)
        }
        const variables = {
            bot: botNickName,
            chatId: this.bots[botNickName]?.chatId,
            query: text,
            source: null,
            withChatBreak: withChatBreak
        };
        const data = await this.makeRequest({
            query: `${queries.sendMessageMutation}`,
            variables: variables,
        });
        await this.listenWs(callback)
        if (!data.data) {
            this.logger.error("Could not send message! Please retry, Data:", data);
        }
        return data;
    }

    /**
     * Add a chat break to the bot, equals to click the clear button
     */
    public async addChatBreak(botNickName: BotNickNameEnum | string) {
        const data = await this.makeRequest({
            query: `${queries.addMessageBreakMutation}`,
            variables: {chatId: this.bots[botNickName]?.chatId},
        });
        if (!data.data) {
            this.logger.debug(data, "Can not clear context! data:");
        }
        return data;
    }

    /**
     * Delete message(s) by message(s) id
     * @param messageIds
     */
    public async deleteMessage(messageIds: number[]) {
        const data = await this.makeRequest({
            query: `${queries.deleteMessageMutation}`,
            variables: {
                messageIds: messageIds
            },
        });
        if (!data.data) {
            this.logger.debug(data, "Can not delete message! data:");
        }
        return data;
    }

    /**
     * Delete all bot messages, equals to click poe.com > Settings > Delete all messages
     */
    public async purgeAllMessage() {
        const payload = JSON.stringify({
            query: "mutation SettingsDeleteAllMessagesButton_deleteUserMessagesMutation_Mutation {\n  deleteUserMessages {\n    viewer {\n      uid\n      id\n    }\n  }\n}\n",
            variables: {},
            queryName: "SettingsDeleteAllMessagesButton_deleteUserMessagesMutation_Mutation",
        })
        const base_string = payload + this.headers["poe-formkey"] + "WpuLMiXEKKE98j56k";
        const headers = {
            "content-type": "application/json",
            "cookie": this.headers.cookie,
            "poe-formkey": this.headers["poe-formkey"],
            "poe-tchannel": this.headers["poe-tchannel"],
            "referer": "https://poe.com/settings",
            "poe-tag-id": CryptoJS.enc.Hex.stringify(CryptoJS.MD5(base_string))
        }

        const response = await this._fetch('https://poe.com/api/gql_POST', {
            method: 'POST',
            headers: headers,
            body: payload
        })
        const data = await response.json()
        if (!data.data) {
            this.logger.debug(data, "Can not purgeAllMessage res:");
        }
        return data;
    }


    /**
     * Get some latest messages from nextData's edges
     * Get first init startCursor from nextData's pageInfo, and use this startCursor to get history messages
     * According to the oldest message's cursor and count, get messages before this cursor
     * Add oldMessages to newMessages, and return newMessages
     * @param botNickName
     * @param count number of messages to get, default 25
     * @param cursor get count of messages before startCursor (cursor represent one message / chat_break line)
     */
    public async getHistory(botNickName: BotNickNameEnum | string, count=25, cursor: string | undefined = undefined): Promise<HistoryItem[]> {
        let messages: HistoryItem[] = []
        let displayName = this.getDisplayName(botNickName)
        if (!displayName) {
            this.logger.error(`Can not find displayName for botNickName: ${botNickName}`)
        }

        // first cursor is in nextData, use this cursor to get latest 5? messages
        if (this.nextData) {
            messages = this.nextData?.props?.pageProps?.payload?.chatOfBotDisplayName?.messagesConnection?.edges ?? []
            cursor = this.nextData?.props?.pageProps?.payload?.chatOfBotDisplayName?.messagesConnection?.pageInfo?.startCursor
        }

        // try to find the latest cursor
        if (!cursor) {
            let chatData = await this.getBotByDisplayName(displayName);

            // let hasPreviousPage = chatData?.messagesConnection?.pageInfo?.hasPreviousPage;
            // if (!hasPreviousPage) {
            //     return chatData?.messagesConnection?.edges || [];
            // }

            // Get cursor and partial messages from bot's info
            messages = chatData.messagesConnection.edges;
            cursor = chatData.messagesConnection.pageInfo.startCursor;
            count -= messages.length;
        }

        if(count <= 0 || !cursor) return messages

        this.logger.debug(`=======================================================\n`)
        this.logger.debug(messages, `messages:`)
        this.logger.debug(`=======================================================\n`)

        while (count > 0) {
            const msgs = await this.getChatList(botNickName, count, cursor);

            this.logger.debug(`=======================================================\n`);
            this.logger.debug(msgs, `msgs:`);
            this.logger.debug(`=======================================================\n`);

            if (msgs === undefined || msgs.pageInfo === undefined || msgs.edges === undefined || msgs.edges.length === 0) {
                this.logger.debug(`msgs === undefined || msgs.pageInfo === undefined || msgs.edges === undefined || msgs.edges.length === 0`)
                break
            }
            messages = msgs.edges.concat(messages);
            count -= msgs.edges.length;
            cursor = msgs.pageInfo.startCursor;
            this.logger.debug(`count: ${count}, cursor: ${cursor}`);
        }

        return messages
    }

    /**
     * need to get bot id first
     * @param botNickName
     * @param count
     * @param cursor
     */
    public async getChatList(botNickName: BotNickNameEnum | string, count=25, cursor: string | undefined) {
        let id = this.bots[botNickName]?.id;
        const displayName = this.getDisplayName(botNickName);
        if (!id && displayName) {
            await this.getBotByDisplayName(displayName)
            id = this.bots[botNickName]?.id;
        }
        if (!id || !cursor) {
            this.logger.error(`Can not find id or cursor for botNickName: ${botNickName}, count: ${count}`);
            return [];
        }

        let response = await this.makeRequest({
            query: `${queries.chatListPaginationQueryPlus}`,
            queryName: "ChatListPaginationQuery",
            variables: {
                id: id,
                count: count > 50 ? 50 : count,
                cursor
            },
        });
        return response.data.node?.messagesConnection;
    }

    /**
     * for websocket(stream response) purpose
     */
    public async subscribe() {
        const query = {
            queryName: 'subscriptionsMutation',
            variables: {
                subscriptions: [
                    {
                        subscriptionName: 'messageAdded',
                        // MessageAddedSubscription.graph
                        query: 'subscription subscriptions_messageAdded_Subscription(\n  $chatId: BigInt!\n) {\n  messageAdded(chatId: $chatId) {\n    id\n    messageId\n    creationTime\n    state\n    ...ChatMessage_message\n    ...chatHelpers_isBotMessage\n  }\n}\n\nfragment ChatMessageDownvotedButton_message on Message {\n  ...MessageFeedbackReasonModal_message\n  ...MessageFeedbackOtherModal_message\n}\n\nfragment ChatMessageDropdownMenu_message on Message {\n  id\n  messageId\n  vote\n  text\n  ...chatHelpers_isBotMessage\n}\n\nfragment ChatMessageFeedbackButtons_message on Message {\n  id\n  messageId\n  vote\n  voteReason\n  ...ChatMessageDownvotedButton_message\n}\n\nfragment ChatMessageOverflowButton_message on Message {\n  text\n  ...ChatMessageDropdownMenu_message\n  ...chatHelpers_isBotMessage\n}\n\nfragment ChatMessageSuggestedReplies_SuggestedReplyButton_message on Message {\n  messageId\n}\n\nfragment ChatMessageSuggestedReplies_message on Message {\n  suggestedReplies\n  ...ChatMessageSuggestedReplies_SuggestedReplyButton_message\n}\n\nfragment ChatMessage_message on Message {\n  id\n  messageId\n  text\n  author\n  linkifiedText\n  state\n  ...ChatMessageSuggestedReplies_message\n  ...ChatMessageFeedbackButtons_message\n  ...ChatMessageOverflowButton_message\n  ...chatHelpers_isHumanMessage\n  ...chatHelpers_isBotMessage\n  ...chatHelpers_isChatBreak\n  ...chatHelpers_useTimeoutLevel\n  ...MarkdownLinkInner_message\n}\n\nfragment MarkdownLinkInner_message on Message {\n  messageId\n}\n\nfragment MessageFeedbackOtherModal_message on Message {\n  id\n  messageId\n}\n\nfragment MessageFeedbackReasonModal_message on Message {\n  id\n  messageId\n}\n\nfragment chatHelpers_isBotMessage on Message {\n  ...chatHelpers_isHumanMessage\n  ...chatHelpers_isChatBreak\n}\n\nfragment chatHelpers_isChatBreak on Message {\n  author\n}\n\nfragment chatHelpers_isHumanMessage on Message {\n  author\n}\n\nfragment chatHelpers_useTimeoutLevel on Message {\n  id\n  state\n  text\n  messageId\n}\n'
                    },
                    {
                        subscriptionName: 'viewerStateUpdated',
                        // ViewerStateUpdatedSubscription.graph
                        query: 'subscription subscriptions_viewerStateUpdated_Subscription {\n  viewerStateUpdated {\n    id\n    ...ChatPageBotSwitcher_viewer\n  }\n}\n\nfragment BotHeader_bot on Bot {\n  displayName\n  ...BotImage_bot\n}\n\nfragment BotImage_bot on Bot {\n  profilePicture\n  displayName\n}\n\nfragment BotLink_bot on Bot {\n  displayName\n}\n\nfragment ChatPageBotSwitcher_viewer on Viewer {\n  availableBots {\n    id\n    ...BotLink_bot\n    ...BotHeader_bot\n  }\n}\n'
                    }
                ]
            },
            query: 'mutation subscriptionsMutation(\n  $subscriptions: [AutoSubscriptionQuery!]!\n) {\n  autoSubscribe(subscriptions: $subscriptions) {\n    viewer {\n      id\n    }\n  }\n}\n'
        };

        await this.makeRequest(query);
    }

    /**
     * Get __NEXT_DATA__ from https://poe.com html. It contains formkey / ipInfo / availableBotsInfo / latestMessageInfo / buildId
     * @private
     */
    public async getNextData() {
        this.logger.debug("=========================== Downloading next_data ===========================");
        const r = await this._fetch("https://poe.com", {
            method: 'GET',
            headers: {cookie: this.headers.cookie}
        })
        const json_regex = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s;
        let html = await r.text();
        let jsonText = json_regex.exec(html)?.[1]; // get script props data
        let nextData = JSON.parse(jsonText!)
        const {props: {pageProps: {data: {viewer}}}} = JSON.parse(jsonText!);

        const formKey = await this.extractFormkey(html) || ''
        this.headers['poe-formkey'] = formKey;
        this.nextData = nextData
        this.viewer = viewer

        this.logger.debug(`\nnextData: ${JSON.stringify(nextData)}\nviewer: ${JSON.stringify(viewer)}`);
        this.logger.debug("=========================== Downloading next_data ===========================\n\n");

        return nextData;
    }

    /**
     * Get channel info to get socket url. For now, poe-tchannel is not store in .env file
     * @private
     */
    private async getChannelData() {
        this.logger.debug("=========================== Downloading channelData ===========================");
        const _setting = await this._fetch(
            'https://poe.com/api/settings',
            { headers: { cookie: this.headers.cookie } },
        );
        if (_setting.status !== 200) throw new Error("Failed to fetch api/settings");
        const channelData = await _setting.json();
        this.tchannelData = channelData.tchannelData
        this.headers['poe-tchannel'] = channelData.tchannelData.channel
        this.logger.debug(channelData, `channelData:`)
        this.logger.debug("=========================== Downloading channelData ===========================\n\n");
        return channelData.tchannelData;
    }

    public connectWs() {
        this.connected = false
        const url = this.getSocketUrl(this.tchannelData);
        this.ws = new WebSocket(url);
        return new Promise((resolve) => {
            const onOpen = () => {
                this.connected = true
                this.logger.debug("Connected to websocket");
                resolve(true)
            };
            const onError = (e: ErrorEvent) => {
                this.connected = false
                this.logger.error("Connection error")
                this.logger.error(e.message);
            }
            this.ws?.on('open', onOpen);
            this.ws.on('error', onError)
        });
    }

    public listenWs(callback?: (result: string) => void) {
        return new Promise((resolve) => {
            const onMessage = (data: any) => {
                let jsonData = JSON.parse(data);
                if (jsonData.messages && jsonData.messages.length > 0) {
                    const messages = JSON.parse(jsonData.messages[0]);
                    const dataPayload = messages.payload.data;
                    const text = dataPayload.messageAdded.text;
                    const state = dataPayload.messageAdded.state;
                    if (state !== 'complete') {
                        callback?.(text)
                    } else {
                        if (!this.ws) {
                            this.logger.error(`state === 'complete' and ws is null, onMsgData:`, JSON.stringify(jsonData))
                        }
                        this.ws?.removeListener('message', onMessage);
                        resolve(true)
                    }
                }
            }
            this.ws.on('message', onMessage);
        })
    }

    public disConnectWs() {
        return new Promise((resolve) => {
            const onClose = () => {
                this.connected = false
                return resolve(true);
            };
            if (this.ws) {
                this.ws.on('close', onClose);
                this.ws.close();
                this.logger.info(`ws closed`)
            }
            this.connected = false
        });
    }

    /**
     * Get all bots info from nextData's viewer["availableBots"]
     */
    public async getBots() {
        this.logger.debug("=========================== Downloading all bots ===========================");
        let bot_list: ViewerBotList
        let bots: any = {}

        if (!this.viewer['availableBotsConnection']) {
            throw new Error("Invalid token or no bots are available. Might: network error, try to getDataNext first. Or Viewer dataStructure changed! Please create an issue on github");
        }
        bot_list = this.viewer["availableBotsConnection"]?.edges;

        for (let bot of bot_list) {
            let displayName = bot?.node?.displayName;
            if(!displayName) continue;
            let chatData: any = await this.getBotByDisplayName(displayName);
            let nickName = chatData?.defaultBotObject?.nickname;
            if(nickName) bots[nickName] = chatData;
        }
        this.bots = bots
        this.logger.debug(`this.bots:${JSON.stringify(this.bots)}`)
        this.logger.debug("=========================== Downloading all bots ===========================\n\n");
        return bots;
    }

    /**
     * Try to get bot's chatId and id, if failed, retry
     * @param displayName BotNickNameEnum
     */
    public async getBotByDisplayName(displayName: string) {
        this.logger.debug(`=========================== getBotByDisplayName(${displayName}) ===========================`);
        const url = `https://poe.com/_next/data/${this.nextData.buildId}/${displayName}.json`;

        const retryRes = await this._fetch(url, {
                method: 'GET',
                headers: {cookie: this.headers.cookie}
            }
        );

        let json = await retryRes.json();
        if (json?.pageProps?.data?.chatOfBotHandle
            && json?.pageProps?.data?.chatOfBotHandle?.chatId
            && json?.pageProps?.data?.chatOfBotHandle?.id) {
            const botNickName = json.pageProps.data.chatOfBotHandle?.defaultBotObject?.nickname;
            if (displayName && botNickName) {
                this.bots[botNickName] = json.pageProps.data.chatOfBotHandle;
                this.nicknames[displayName] = botNickName
                this.displayNames[botNickName] = displayName;
            }
            this.logger.debug(`getBot:${displayName}, url:${url}, (${botNickName})this.bots[${botNickName}]: \n${JSON.stringify(this.bots[botNickName])}`)
            this.logger.debug("=========================== getBotByDisplayName ===========================\n\n");
            return json?.pageProps?.data?.chatOfBotHandle;
        }
        this.logger.debug("=========================== getBotByDisplayName ===========================\n\n");
    }

    /**
     * Get bot's displayName, capybara ==> Sage etc.
     * @param botNickName
     */
    public getDisplayName(botNickName: BotNickNameEnum | string) {
        const displayName = this.displayNames[botNickName] || this.bots[botNickName]?.defaultBotObject?.displayName || (typeof botNickName !== 'string' && DisplayName[botNickName]);
        if (!displayName) {
            this.logger.error(`getDisplayNameByNickName failed, botNickName: ${botNickName}`)
        }
        return displayName;
    }

    /**
     * Get socket url
     * @param tchannelData tchannelData from this.getChannelData()
     * @private
     */
    private getSocketUrl(tchannelData: TchannelData) {
        const tchRand = Math.floor(1e6 * Math.random()) + 1; // They're surely using 6 digit random number for ws url.
        const socketUrl = `wss://tch${tchRand}.tch.quora.com`;
        const boxName = tchannelData.boxName;
        const minSeq = tchannelData.minSeq;
        const channel = tchannelData.channel;
        const hash = tchannelData.channelHash;
        const wsUrl = `${socketUrl}/up/${boxName}/updates?min_seq=${minSeq}&channel=${channel}&hash=${hash}`
        this.logger.debug(`wsUrl:${wsUrl}`)
        return wsUrl;
    }

    /**
     * Send POST request to https://poe.com/api/gql_POST
     * @param request
     */
    public async makeRequest(request: any) {
        let payload = JSON.stringify(request);
        const base_string = payload + this.headers["poe-formkey"] + "WpuLMiXEKKE98j56k";
        let headers = {
            'poe-formkey': this.headers["poe-formkey"],
            'poe-tchannel': this.headers["poe-tchannel"],
            'cookie': this.headers.cookie,
            "content-type": "application/json",
            "poe-tag-id": CryptoJS.enc.Hex.stringify(CryptoJS.MD5(base_string))
        };
        const response = await this._fetch('https://poe.com/api/gql_POST', {
            method: 'POST',
            headers: headers,
            body: payload
        })
        return await response.json();
    }

    /**
     * extract formkey from https://poe.com html
     * @param html string
     * @private
     */
    private async extractFormkey(html: string) {
        const scriptRegex = /<script>if\s*\(.+\)\s*throw new Error;(.+)<\/script>/;
        // const scriptRegex = new RegExp('<script>if\\s*\\(.+\\)\\s*throw new Error;(.+)</script>');
        let regExpExecArray = scriptRegex.exec(html);
        const scriptText = regExpExecArray?.[1] || '';
        this.logger.debug({regExpExecArray, scriptText}, `regExpExecArray and scriptText: `)
        const keyRegex = /var .\s*=\s*"([0-9a-f]+)",/;
        let regExpExecArray1 = keyRegex.exec(scriptText);
        if (!regExpExecArray1) {
            this.logger.error(`Could match ${keyRegex} from scriptText:`, scriptText)
            return
        }

        const keyText = regExpExecArray1[1];
        if (!keyText) {return}
        this.logger.debug(keyText, `keyText:`)

        const cipherRegex = /.\[(\d+)\]\s*=\s*.\[(\d+)\]/g;
        const cipherPairs = scriptText.matchAll(cipherRegex);
        // this.logger.debug({cipherRegex, cipherPairs}, `cipherRegex and cipherPairs: `)

        const formkeyList: any[] = [];
        for (const pair of cipherPairs) {
            // this.logger.debug(pair, `pair:`)
            const [_, formkeyIndex, keyIndex] = pair;
            // @ts-ignore
            formkeyList[formkeyIndex] = keyText[keyIndex];
        }
        const formkey = formkeyList.join("");
        this.logger.debug(formkey, `formkey:`)
        if (!formkey) {
            throw new Error("Could not extract formkey from scriptText");
        }
        return formkey;
    }

    /**
     * fetch poe-formkey, buildId, [BotDisplayName]_chatId, [BotDisplayName]_id and rewrite in .env !
     */
    public async updateAllBotInfo(rewriteToLocalEnvFile: boolean = true) {
        await this.getNextData();
        await this.getBots();

        if (!this.nextData.buildId || !this.headers["poe-formkey"]) {
            this.logger.error("Could not extract buildId from html");
            return;
        }

        // read .env file by fs
        const envPath = path.resolve(".env");

        // set key value pair to .env file
        const envConfig = rewriteToLocalEnvFile ? dotenv.parse(fs.readFileSync(envPath)) : this.env;
        this.logger.debug(`${rewriteToLocalEnvFile ? '[rewrite to .env enable]' : ''}[poe-formkey] old:${envConfig["poe-formkey"]}, new: ${this.headers["poe-formkey"]}`)
        this.logger.debug(`${rewriteToLocalEnvFile ? '[rewrite to .env enable]' : ''}[buildId] old:${envConfig["buildId"]}, new: ${this.nextData.buildId}`)
        envConfig["poe-formkey"] = this.headers["poe-formkey"];
        envConfig["buildId"] = this.nextData.buildId;

        for (const botNickName in this.bots) {
            if (!this.bots[botNickName] || !this.bots[botNickName]?.chatId || !this.bots[botNickName]?.id) {
                this.logger.debug(`${botNickName} in this.bots is not valid!, this.bots[${botNickName}]:\n${JSON.stringify(this.bots[botNickName], null, 2)}`)
                continue;
            }
            let displayName = this.getDisplayName(botNickName as BotNickNameEnum)
            if (displayName.includes("+")) {
                displayName = displayName.replace("+", "_2");// can't read a2_2_-_Claude+_chatId from env file, so replace it to _2
            }
            const envBotChatIdK = `${botNickName}_-_${displayName}_chatId`;
            const envBotChatIdV = this.bots[botNickName]?.chatId+'';
            const envBotIdK = `${botNickName}_-_${displayName}_id`;
            const envBotIdV = this.bots[botNickName]?.id+'';

            this.logger.debug(`${rewriteToLocalEnvFile ? '[rewrite to .env enable]' : ''}[${displayName}_chatId] old:${envConfig[envBotChatIdK]}, new: ${envBotChatIdV} && [${displayName}_id] old:${envConfig[envBotIdK]}, new: ${envBotIdV}`)
            envConfig[envBotChatIdK] = envBotChatIdV;
            envConfig[envBotIdK] = envBotIdV;
        }

        this.env = envConfig

        if (rewriteToLocalEnvFile) {
            // update env
            const envConfigString = Object.entries(envConfig)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');

            // write to .env file
            fs.writeFileSync(envPath, envConfigString);
            this.logger.info(`.env file updated`);

            // reload env file
            dotenv.config();
            this.env = process.env;
        }
    }
}


export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

