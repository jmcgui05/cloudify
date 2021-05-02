const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const apiGateway = require('@aws-cdk/aws-apigateway');

class CloudifyStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Dynamodb table
    const table = new dynamodb.Table(this, 'Hello', {
      partitionKey: { name: 'name', type: dynamodb.AttributeType.STRING },
    });

    // lambda test
    const lambdaFunction = new lambda.Function(this, 'DynamoLambdaHandler',  {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('handlers'),
      handler: 'api.hello',
      environment: {
        HELLO_TABLE_NAME: table.tableName
      }
    });

    // lambda dynamo permissions
    table.grantReadWriteData(lambdaFunction);

    // api gateway test
    const api = new apiGateway.RestApi(this, 'test-api');

    api
    .root
    .resourceForPath('hello')
    .addMethod('GET', new apiGateway.LambdaIntegration(lambdaFunction));

    new cdk.CfnOutput(this, 'HTTP URL', {
      value: api.url || 'Something went wrong'
    });
  }
}

module.exports = { CloudifyStack }
