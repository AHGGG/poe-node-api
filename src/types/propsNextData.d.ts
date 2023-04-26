declare type PropsNextData = {
    props: {
        bid: string
        requestHeaders: {
            host: string
            "x-request-id": string
            "x-request-start-time": string
            connection: string
            "x-real-ip": string
            "x-forwarded-for": string
            "x-forwarded-proto": string
            "x-forwarded-port": string
            "x-amzn-trace-id": string
            cookie: string
            accept: string
            "accept-language": string
            "sec-fetch-mode": string
            "user-agent": string
            "accept-encoding": string
        }
        middlewareStart: string
        path: string
        pageProps: {
            payload: {
                chatOfBotDisplayName: {
                    defaultBotObject: {
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
                    shouldShowDisclaimer: boolean
                    __isNode: string
                    messagesConnection: {
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
                viewer: {
                    uid: number
                    primaryEmail: string
                    poeUser: {
                        fullName: string
                        id: string
                        handle: any
                    }
                    availableBots: Array<{
                        id: string
                        handle: string
                        displayName: string
                        messageLimit: {
                            dailyLimit?: number
                            monthlyLimit?: number
                        }
                        deletionState: string
                        image: {
                            __typename: string
                            localName: string
                        }
                        __isNode: string
                        isPrivateBot: boolean
                        viewerIsCreator: boolean
                    }>
                    allowUserCreatedBots: boolean
                    enableUserProfilePage: boolean
                    hasCompletedMultiplayerNux: boolean
                    enableNux: boolean
                    allowImages: boolean
                    allowImagesForApiBots: boolean
                    improvedCodeblocks: boolean
                    allowsUserBotCreation: boolean
                    showBotInfoCard: boolean
                    subscription: {
                        isActive: boolean
                        id: string
                        expiresTime: any
                        willCancelAtPeriodEnd: any
                    }
                    isEligibleForWebSubscriptions: boolean
                    webSubscriptionPriceInfo: {
                        yearlyPrice: string
                        yearlyPricePerMonth: string
                        yearlyPercentageSavings: string
                        isFreeTrialAvailable: boolean
                        id: string
                        monthlyPrice: string
                    }
                    shouldSeeWebSubscriptionAnnouncement: boolean
                    id: string
                }
            }
            queryVariables: {}
            additionalProps: {}
        }
        __N_SSP: boolean
    }
    page: string
    query: {}
    buildId: string
    isFallback: boolean
    gssp: boolean
    appGip: boolean
    scriptLoader: Array<any>
}
