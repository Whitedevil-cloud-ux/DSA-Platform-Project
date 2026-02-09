function generateReinforcementSignal(user, recoverySignal){
    if(!recoverySignal) return null;
    if(recoverySignal.type === "RECOVERY_STARTED"){
        return{
            type: "WELCOME_BACK",
            intensity: "soft",
            context: {
                day: recoverySignal.day,
            },
        };
    }
    if(recoverySignal.type === "RECOVERY_ENDED"){
        return {
            type: "RECOVERY_ENDED",
            intensity: "neutral",
        };
    }
    return null;
}

module.exports = { generateReinforcementSignal, };