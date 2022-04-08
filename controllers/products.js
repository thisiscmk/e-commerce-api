const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
  // //filtering database results using find method and a regular expression for pattern matching
  // const products = await Product.find({ name: { $regex: search, $options: "i" } }) // i means case insensitive
  // //create a search pattern string
  // const search = "ab"

  //filtering database results
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("name")
    .select("name price")
    .limit(10)
    .skip(5)
  res.status(200).json({ products, length: products.length })
}

const getAllProducts = async (req, res) => {
  //filtering database results using queries
  const { featured, company, name, sort, fields, numericFilters } = req.query
  //create an empty query object
  const queryObject = {}
  //if a featured parameter exists in the query
  if (featured) {
    // create a new property in the query object and set it to true if the
    // featured property in the request query is true, otherwise set it to false
    queryObject.featured = featured === "true" ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  //if a name parameter exists in the request query, store it into the query object in the name property
  //using a regular expression
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }

  //convert the query string into a mongoDb query
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte"
    }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filter = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`)

    const options = ["price", "rating"]
    filter = filter.split(",").forEach(item => {
      const [field, operator, value] = item.split("-")
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
    // console.log(filter)
  }

  console.log(queryObject)
  let result = Product.find(queryObject)

  //sorting data
  if (sort) {
    //split them up then join them back together to evade the comma when there are multiple sorting parameters
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  //select specific fields from the database records
  if (fields) {
    const fieldsList = fields.split(",").join(" ")
    result = result.select(fieldsList)
  }

  //skip & limit
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result

  res.status(200).json({ products, length: products.length })
}

module.exports = { getAllProducts, getAllProductsStatic }
