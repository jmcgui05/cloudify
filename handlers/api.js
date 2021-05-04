const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";
const uuid = require('uuid-random');

/*
@param event: {name, price, tags}
*/
async function postProduct(event) {
  if (!validProduct) {
    return {
      statusCode: 400,
      body: "Product requires fields name (max 40 chars), price and tags"
    }
  }
  const { name, price, tags } = event;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      "id": uuid(),
      "name": name,
      "price": price,
      "tags": tags
    }
  };

  try {
    const response = await db 
      .put(params)
      .promise()
      .then(res => res)
      .catch(err => err);

    return {
      statusCode: 201,
      body: `Successfully saved product`
    }

  } catch (err) {
    return {
      statusCode: err.statusCode,
      body: err.message
    }
  }
}

/*
@param event: {id}
*/
async function getProductById(event) {
  const { id } = event.queryStringParameters;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    }
  };

  try {
    const response = await db 
    .get(params)
    .promise();

    const { id, name, price, tags } = response.Item;

    return {
      statusCode: 200,
      body: JSON.stringify({id, name, price, tags})
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error getting product. ${err.message}`
    }
  }
}

/*
@param event: {tags}
*/
async function getProductByTags(event) {
  const { tags } = event.queryStringParameters;

  const params = {
    FilterExpression: "contains(#tags, :tags)",
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#tags": "tags",
    },
    ExpressionAttributeValues: {
        ":tags": tags,
    } 
  };
  try {
    const response = await db 
    .scan(params)
    .promise();

    return {
      statusCode: 200,
      body: response
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error getting product. ${err.message}`
    }
  }
}

// helper function to validate requirements
function validProduct(params) {
  const { name, price, tags } = params;
  const isValid = [name, price, tags].every((currentValue) => currentValue != null);
  return isValid && name.length <= 40;
}

module.exports = {
  postProduct,
  getProductById,
  getProductByTags
}