declare type Viewer = {
    uid?: number
    primaryEmail?: string
    poeUser?: {
        fullName: any
        id: string
        handle: any
        creationTime: number
    }
    enableRightSidebar?: boolean
    availableBotsConnection?: {
        edges: ViewerBotList
        pageInfo: {
            endCursor: string
            hasNextPage: boolean
        }
        id: string
    }
    hasActiveSubscription?: boolean
    allowUserCreatedBots?: boolean
    poeImproveBotDiscoverability?: boolean
    isEligibleForWebSubscriptions?: boolean
    hasCompletedMultiplayerNux?: boolean
    allowImages?: boolean
    allowImagesForApiBots?: boolean
    promptBotImageDomainWhitelist?: Array<string>
    botCreationEnabled?: boolean
    useImprovedOverflowMenu?: boolean
    shoulShowModelInMessageLimitText?: boolean
    subscription?: {
        isActive: boolean
        id: string
        expiresTime: any
        willCancelAtPeriodEnd: any
        purchaseRevocationReason: any
    }
    shouldSeeWebSubscriptionAnnouncement?: boolean
    subscriptionBots?: Array<{
        id: string
        displayName: string
        deletionState: string
        image: {
            __typename: string
            localName: string
        }
    }>
    webSubscriptionPriceInfo?: {
        isFreeTrialAvailable: boolean
        id: string
    }
    shouldSeeResponseSpeedUpsell?: boolean
    defaultBot?: {
        botId: number
        id: string
    }
    alwaysAllow?: boolean
    voiceInputEnabled?: boolean
    fileInputEnabled?: boolean
    ignoreFileUploadLimit?: boolean
    shoulShowModelInMessageLimit?: boolean
    enableRemoveBotFromSidebar?: boolean
    id?: string
    enableI18n?: boolean
    downloadPromptAndroidAppVariant?: any
}

declare type ViewerBotList = Array<ViewerBot>
declare type ViewerBot = {
    node: {
        id: string
        handle: string
        botId: number
        displayName: string
        isLimitedAccess: boolean
        deletionState: string
        image: {
            __typename: string
            localName: string
        }
        __isNode: string
        isPrivateBot: boolean
        viewerIsCreator: boolean
        isSystemBot: boolean
        __typename: string
    }
    cursor: string
    id: string
}
