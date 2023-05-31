declare type Viewer = {
    uid?: number
    primaryEmail?: string
    poeUser?: {
        fullName: any
        id: string
        handle: any
        creationTime: number
    }
    viewerBotList?: ViewerBotList
    allowUserCreatedBots?: boolean
    enableExploreBotsPage?: boolean
    subscriptionBots?: Array<{
        displayName: string
        messageLimit: {
            monthlyLimit: number
        }
        id: string
        deletionState: string
        image: {
            __typename: string
            localName: string
        }
    }>
    webSubscriptionPriceInfo?: {
        yearlyPrice: string
        yearlyPricePerMonth: string
        yearlyPercentageSavings: string
        isFreeTrialAvailable: boolean
        id: string
        monthlyPrice: string
    }
    isEligibleForWebSubscriptions?: boolean
    enableUserProfilePage?: boolean
    enableSubscriptionButton?: boolean
    hasActiveSubscription?: boolean
    hasCompletedMultiplayerNux?: boolean
    enableNux?: boolean
    allowImages?: boolean
    allowImagesForApiBots?: boolean
    allowsUserBotCreation?: boolean
    enableSharingApiBots?: boolean
    webPurchasesEnabled?: boolean
    removeWelcomeTopicsVariant?: any
    showStopButton?: boolean
    subscription?: {
        isActive: boolean
        id: string
        expiresTime: any
        willCancelAtPeriodEnd: any
    }
    shouldSeeWebSubscriptionAnnouncement?: boolean
    voiceInputEnabled?: boolean
    enableRemoveBotFromSidebar?: boolean
    availableBots?: Array<{
        botId: number
        id: string
    }>
    enableI18n?: boolean
    id?: string
}

declare type ViewerBotList = Array<ViewerBot>
declare type ViewerBot = {
    id: string
    botId: number
    handle: string
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
}
