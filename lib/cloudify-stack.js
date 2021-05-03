const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const apiGateway = require('@aws-cdk/aws-apigateway');
const path = require('path');

class CloudifyStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Dynamodb table
    const dynamoTable = new dynamodb.Table(this, 'Products', {
      partitionKey: { 
        name: 'id', 
        type: dynamodb.AttributeType.STRING 
      },
      tableName: 'products'
    });

    const postProductLambda = new lambda.Function(this, 'PostProductLambda',  {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join("./handlers/")),
      handler: 'handlers/api.postProduct',
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      }
    });

    const getProductByIdLambda = new lambda.Function(this, 'GetProductByIdLambda',  {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join("./handlers/")),
      handler: 'handlers/api.getProductById',
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      }
    });

    const getProductsByTagsLambda = new lambda.Function(this, 'GetProductsByTagsLambda',  {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join("./handlers/")),
      handler: 'handlers/api.getProductByTags',
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "id",
      }
    });

    // lambda dynamo permissions
    dynamoTable.grantReadWriteData(postProductLambda);
    dynamoTable.grantReadWriteData(getProductByIdLambda);
    dynamoTable.grantReadWriteData(getProductsByTagsLambda);

    // api gateway test
    const api = new apiGateway.RestApi(this, 'cloudify-api');
    const products = api.root.addResource('products');
    products.addMethod('POST', new apiGateway.LambdaIntegration(postProductLambda));

    const product = products.addResource('{id}');
    product.addMethod('GET', new apiGateway.LambdaIntegration(getProductByIdLambda));

    // const tagResource = products.addResource('{tags}')
    // tagResource.addMethod('GET', new apiGateway.LambdaIntegration(getProductsByTagsLambda));


    new cdk.CfnOutput(this, 'HTTP URL', {
      value: api.url || 'Something went wrong'
    });
  }
}

module.exports = { CloudifyStack }
