const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema({
     webImage: {
        type: [String],
        required: true,
    },
      productId: {
        type: String,
        required: false,
    },
    
});

module.exports = mongoose.model("Header", headerSchema);