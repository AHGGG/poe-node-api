declare type FetchFunction = typeof fetch
declare interface PoeClientOptions{
    cookie?: string
    proxy?: ProxyInfo
    debug?: boolean
    fetch?: FetchFunction
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


declare interface EdgeItem {
    node?: Node
    cursor?: string
    id?: string
}

declare interface Node {
    id: string
    messageId: number
    creationTime: number
    text: string
    author: string
    linkifiedText: string
    state: string
    contentType: string
    suggestedReplies: any[]
    vote: any
    voteReason: any
    chat: Chat
    __isNode: string
    __typename: string
}

declare interface Chat {
    chatId: number
    defaultBotNickname: string
    id: string
}
