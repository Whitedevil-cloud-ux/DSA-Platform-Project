function mapIntentToMessage(intent){
    const messageMap = {
        STABILIZE: {
            tone: "calm",
            message: "Let's reset rhythm. Solve one focused problem.",
            actionLabel: "Start Problem",
        },

        PUSH: {
            tone: "focused",
            message: "You are operating below your ceiling. Try one harder problem.",
            actionLabel: "Try Harder",
        },
        
        REINFORCE: {
            tone: "respectful",
            message: "Strong consistency this week.",
            actionLabel: null,
        },

        RECOVER: {
            tone: "supportive",
            message: "Small step. One easy problem to restart flow.",
            actionLabel: "Start Easy",
        },

        MAINTAIN: {
            tone: "neutral",
            message: "Maintain current pace.",
            actionLabel: null,
        },

        SILENT: null,
    };

    return messageMap[intent] || null;
}

module.exports = { mapIntentToMessage, };