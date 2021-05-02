#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { CloudifyStack } = require('../lib/cloudify-stack');

const app = new cdk.App();
new CloudifyStack(app, 'CloudifyStack');
