const mongoose = require("mongoose");

const pressureEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },

    type: {
        type: String,
        enum: ["CHAIN_BROKEN", "FIRST_COMMIT"],
        required: true,
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true,
    },

    context: {
        type: Object(),
        default: {},
    },

    isConsumed: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("PressureEvent", pressureEventSchema);