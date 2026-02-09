const { getTodayDate } = require("../util/DateUtils");

function shouldTriggerResponse(user, pressureSignal){
    if(!pressureSignal) return false;

    // cooldown active -> silence
    if(user.pressureCooldownUntil && user.pressureCooldownUntil > new Date()){
        return false;
    }

    // recovery phase
    if(user.inRecovery){
        return false;
    }
    
    const today = getTodayDate();
    if(user.lastPressureAt && user.lastPressureAt.toISOString().slice(0, 10) === today){
        return false;
    }
    if(pressureSignal.severity === "low"){
        return false;
    }
    if(pressureSignal.severity === "medium"){
        //Allow once every 2 days
        if(!user.lastPressureAt) return true;
        const diffDays = (new Date(today)-user.lastPressureAt)/ (1000 * 60 * 60 * 24);
        return diffDays >= 2;
    }
    if(pressureSignal.severity === "high"){
        return true;
    }
}

module.exports = { shouldTriggerResponse, };