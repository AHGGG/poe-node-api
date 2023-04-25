export declare enum BotNickNameEnum {
    'a2' = "a2",
    'a2_2' = "a2_2",
    'beaver' = "beaver",
    'capybara' = "capybara",
    'nutria' = "nutria",
    'chinchilla' = "chinchilla",
    'hutia' = "hutia"
}
export declare enum DisplayNameEnum {
    'Claude-instant' = "Claude-instant",
    'Claude+' = "Claude+",
    'GPT-4' = "GPT-4",
    'Sage' = "Sage",
    'Dragonfly' = "Dragonfly",
    'ChatGPT' = "ChatGPT",
    'NeevaAI' = "NeevaAI"
}
type DisplayNameType = {
    [key in BotNickNameEnum]: DisplayNameEnum;
};
type NickNameType = {
    [key in DisplayNameEnum]: BotNickNameEnum;
};
export declare const DisplayName: DisplayNameType;
export declare const NickName: NickNameType;
export declare class PoeClient {
    private bots;
    private viewer;
    private nextData;
    private readonly debug;
    private connected;
    private headers;
    private tchannelData;
    protected _fetch: FetchFunction;
    constructor(opts: PoeClientOptions);
    /**
     * Read .env file and set poe-formkey / buildId / botsInfo to memory
     */
    setBotId(): void;
    /**
     * If !poe-formkey || !buildId || !this.nextData, will updateAllBotInfo and write poe-formkey / buildId / botsInfo to .env file, for next chat use.
     * And get channel info => subscribe => connectWs
     */
    init(): Promise<void>;
    /**
     * send message to bot
     * @param text user input
     * @param botNickName bot nick name, like capybara(Sage) / a2(Claude-instant) / a2_2(Claude+) etc.
     * @param withChatBreak
     * @param callback
     */
    sendMessage(text: string, botNickName: BotNickNameEnum, withChatBreak?: boolean, callback?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): Promise<any>;
    /**
     * Add a chat break to the bot, equals to click the clear button
     */
    addChatBreak(botNickName: BotNickNameEnum): Promise<any>;
    /**
     * Delete message(s) by message(s) id
     * @param messageIds
     */
    deleteMessage(messageIds: number[]): Promise<any>;
    /**
     * Delete all bot messages, equals to click poe.com > Settings > Delete all messages
     */
    purgeAllMessage(): Promise<any>;
    /**
     * Get some latest messages from nextData's edges
     * Get first init startCursor from nextData's pageInfo, and use this startCursor to get history messages
     * According to the oldest message's cursor and count, get messages before this cursor
     * Add oldMessages to newMessages, and return newMessages
     * @param botNickName
     * @param count number of messages to get, default 25
     * @param cursor get count of messages before startCursor (cursor represent one message / chat_break line)
     */
    getHistory(botNickName: BotNickNameEnum, count?: number, cursor?: string | undefined): Promise<any[]>;
    /**
     * need to get bot id first
     * @param botNickName
     * @param count
     * @param cursor
     */
    getChatList(botNickName: BotNickNameEnum, count: number | undefined, cursor: string | undefined): Promise<any>;
    /**
     * for websocket(stream response) purpose
     */
    subscribe(): Promise<void>;
    /**
     * Get __NEXT_DATA__ from https://poe.com html. It contains formkey / ipInfo / availableBotsInfo / latestMessageInfo / buildId
     * @private
     */
    getNextData(): Promise<any>;
    /**
     * Get channel info to get socket url. For now, poe-tchannel is not store in .env file
     * @private
     */
    private getChannelData;
    connectWs(): Promise<unknown>;
    listenWs(callback?: (result: string) => void): Promise<unknown>;
    disConnectWs(): Promise<unknown>;
    /**
     * Get all bots info from nextData's viewer["availableBots"]
     */
    getBots(): Promise<any>;
    /**
     * Try to get bot's chatId and id, if failed, retry
     * @param botNickName BotNickNameEnum
     * @param retry retry how many times, default 10
     * @param retryIntervalMs retry interval, default 2000ms
     */
    getBotByNickName(botNickName: BotNickNameEnum, retry?: number, retryIntervalMs?: number): Promise<any>;
    /**
     * Get bot's displayName, capybara ==> Sage etc.
     * @param botNickName
     */
    getDisplayName(botNickName: BotNickNameEnum): any;
    /**
     * Get socket url
     * @param tchannelData tchannelData from this.getChannelData()
     * @private
     */
    private getSocketUrl;
    /**
     * Send POST request to https://poe.com/api/gql_POST
     * @param request
     */
    makeRequest(request: any): Promise<any>;
    /**
     * extract formkey from https://poe.com html
     * @param html string
     * @private
     */
    private extractFormkey;
    /**
     * fetch poe-formkey, buildId, [BotDisplayName]_chatId, [BotDisplayName]_id and rewrite in .env !
     */
    updateAllBotInfo(): Promise<void>;
}
export declare const sleep: (ms: number) => Promise<unknown>;
export {};
