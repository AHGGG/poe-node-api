declare type Viewer = {
    uid?: number
    primaryEmail?: string
    poeUser?: {
        fullName: any
        id: string
        handle: any
    }
    availableBots?: Array<{
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
    allowUserCreatedBots?: boolean
    enableUserProfilePage?: boolean
    hasCompletedMultiplayerNux?: boolean
    enableNux?: boolean
    allowImages?: boolean
    allowImagesForApiBots?: boolean
    improvedCodeblocks?: boolean
    allowsUserBotCreation?: boolean
    showBotInfoCard?: boolean
    subscription?: {
        isActive: boolean
        id: string
        expiresTime: any
        willCancelAtPeriodEnd: any
    }
    isEligibleForWebSubscriptions?: boolean
    webSubscriptionPriceInfo?: {
        yearlyPrice: string
        yearlyPricePerMonth: string
        yearlyPercentageSavings: string
        isFreeTrialAvailable: boolean
        id: string
        monthlyPrice: string
    }
    shouldSeeWebSubscriptionAnnouncement?: boolean
    id?: string
}
