const mongoose = require("mongoose")

//create the database blueprint
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a product name"]
  },
  price: {
    type: Number,
    required: [true, "please provide a product number"]
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  company: {
    type: String,
    //limit the options for this property (like a list box)
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported"
    }
    //enum:['ikea', 'liddy', 'caressa', 'marcos']
  }
})

//instantiate it and export it
module.exports = mongoose.model("Product", productSchema)
