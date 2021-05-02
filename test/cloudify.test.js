const { expect, haveResource } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Cloudify = require('../lib/cloudify-stack');

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cloudify.CloudifyStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cloudify.CloudifyStack(app, 'MyTestStack');
  // THEN
  expect(stack).to(haveResource("AWS::SNS::Topic"));
});
