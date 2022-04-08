//js file to dynamically insert the product list from products.json, into the database

require("dotenv").config()

//import the file with the database connection
const connectDB = require("./db/connect")
//import the file defining the database schema(structure)
const Product = require("./models/product")

//import the product list
const jsonProducts = require("./products.json")

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    //empty the database just to be sure
    await Product.deleteMany()
    //insert the array of product objects into the database
    await Product.create(jsonProducts)
    console.log("Success!!!")
    //after the products have been inserted into the database, there's no need to keep running this file
    process.exit(0) //0 is a code for success
  } catch (error) {
    console.log(error)
    process.exit(1) //1 is a code for error
  }
}

start()
