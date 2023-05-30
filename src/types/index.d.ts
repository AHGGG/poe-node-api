declare type FetchFunction = typeof fetch
declare interface PoeClientOptions{
    cookie?: string
    env?: ProcessEnv
    proxy?: ProxyInfo
    debug?: boolean
    logLevel?: string
    fetch?: FetchFunction
    retry?: number
    retryMsInterval?: number
}
declare interface ProxyInfo{
    socks?: {
        host: string,
        port: number,
    }
    https?: {
        proxy?: string,
        allProxy?: string,
    }
}
declare interface TchannelData {
    minSeq: string
    channel: string
    channelHash: string
    boxName: string
    baseHost: string
    targetUrl: string
    enableWebsocket: boolean
}
declare interface PoeHeaders{
    'poe-formkey': string
    'poe-tchannel': string
    cookie: string
}

declare interface HistoryItem {
    node: HistoryItemNode
    cursor: string
    id: string
}

declare interface HistoryItemNode {
    id: string
    messageId: number
    creationTime: number
    text: string
    author: string
    linkifiedText: string
    state: string
    contentType: string
    suggestedReplies: string[]
    vote: any
    voteReason: any
    chat: HistoryItemChat
    __isNode: string
    __typename: string
}

declare interface HistoryItemChat {
    chatId: number
    defaultBotNickname: string
    id: string
}

declare interface ProcessEnv extends Dict<string> {}
declare interface Dict<T> {
    [key: string]: T | undefined;
}
