function getMessageTemplate(pressureEvent){
    const { type, severity, context } = pressureEvent;
    if(type === "CHAIN_BROKEN"){
        if(severity === "high"){
            return {
                title: "Streak Broken",
                tone: "reflective"
            };
        }

        if(severity === "medium"){
            return {
                title: "You lost momentum",
                tone: "gentle",
            };
        }
    }
    if(type === "FIRST_COMMIT"){
        return {
            title: "Good start",
            tone: "encouraging",
        };
    }
    return null;
}

module.exports = { getMessageTemplate };