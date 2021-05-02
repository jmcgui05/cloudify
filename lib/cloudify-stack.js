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
        name: 'productId', 
        type: dynamodb.AttributeType.STRING 
      },
      tableName: 'products'
    });

    // lambda test
    const lambdaFunction = new lambda.Function(this, 'DynamoLambdaHandler',  {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join("./handlers/")),
      handler: 'handlers/api.postProduct',
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "productId",
      }
    });

    // lambda dynamo permissions
    dynamoTable.grantReadWriteData(lambdaFunction);

    // api gateway test
    const api = new apiGateway.RestApi(this, 'cloudify-api');

    api
    .root
    .resourceForPath('product')
    .addMethod('POST', new apiGateway.LambdaIntegration(lambdaFunction));

    new cdk.CfnOutput(this, 'HTTP URL', {
      value: api.url || 'Something went wrong'
    });
  }
}

module.exports = { CloudifyStack }
