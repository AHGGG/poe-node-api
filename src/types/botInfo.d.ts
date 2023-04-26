declare type BotInfo = {
    defaultBotObject?: {
        displayName: string
        id: string
        hasWelcomeTopics: boolean
        deletionState: string
        image: {
            __typename: string
            localName: string
        }
        __isNode: string
        creator: any
        description: string
        poweredBy: string
        messageLimit: {
            numMessagesRemaining: any
            shouldShowRemainingMessageCount: boolean
            dailyLimit: any
            resetTime: number
            dailyBalance: any
        }
        nickname: string
        hasSuggestedReplies: boolean
        disclaimerText: string
        isApiBot: boolean
        contextClearWindowSecs: number
        introduction: string
        model: string
        isSystemBot: boolean
        isPrivateBot: boolean
        viewerIsCreator: boolean
        hasClearContext: boolean
        isDown: boolean
        handle: string
        viewerIsFollower: boolean
        isPromptPublic: boolean
        promptPlaintext: string
        botId: number
        followerCount: number
    }
    id: string
    chatId: number
    shouldShowDisclaimer?: boolean
    __isNode?: string
    messagesConnection?: {
        edges: Array<{
            node: {
                id: string
                messageId: number
                creationTime: number
                text: string
                author: string
                linkifiedText: string
                state: string
                contentType: string
                suggestedReplies: Array<string>
                vote: any
                voteReason: any
                chat: {
                    chatId: number
                    defaultBotNickname: string
                    id: string
                }
                __isNode: string
                __typename: string
            }
            cursor: string
            id: string
        }>
        pageInfo: {
            hasPreviousPage: boolean
            startCursor: string
        }
        id: string
    }
}

declare type Bots = {
    [key in 'a2' | 'a2_2' | 'beaver' | 'capybara' | 'nutria' | 'chinchilla' | 'hutia' | string]: BotInfo
}
