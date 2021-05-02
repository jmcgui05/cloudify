const AWS = require("aws-sdk");
const db = new AWS.DynamoDB;
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";

async function postProduct(event) {
  const { productId, name, price, tags } = event;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      "productId": {
        S: productId
      },
      "name": {
        S: name
      },
      "price": {
        N: price
      },
      "tags": {
        SS: tags
      } 
    }
  };

  try {
    const response = await db 
      .putItem(params)
      .promise()
      .then(res => res)
      .catch(err => err);

    return {
      statusCode: 200,
      body: `Successfully saved product with id ${productId}`
    }

  } catch (err) {
    return {
      statusCode: err.statusCode,
      body: err.message
    }
  }
}

async function getProductById(event) {

}

async function getProductByTags(event) {

}

module.exports = {
  postProduct,
  getProductById,
  getProductByTags
}