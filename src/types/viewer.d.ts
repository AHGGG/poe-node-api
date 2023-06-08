declare type Viewer = {
    uid?: number
    primaryEmail?: string
    poeUser?: {
        fullName: any
        id: string
        handle: any
        creationTime: number
    }
    availableBotsConnection?: {
        edges: ViewerBotList
        id: string
    }
    showSubscriptionSubtitle?: boolean
    hasActiveSubscription?: boolean
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
    hasCompletedMultiplayerNux?: boolean
    enableNux?: boolean
    allowImages?: boolean
    allowImagesForApiBots?: boolean
    botCreationEnabled?: boolean
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
    deferWebSubscriptionAnnouncementExptVariant?: any
    voiceInputEnabled?: boolean
    shoulShowModelInMessageLimit?: boolean
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
    }
    id: string
}
