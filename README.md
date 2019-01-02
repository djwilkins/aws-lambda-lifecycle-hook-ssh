# aws-lambda-lifecycle-hook-ssh
This aws lambda function (node js) works when triggered by an autoscaling lifecycle hook.  The autoscaling hook here indirectly kicks off the lambda function through an SNS topic update, which in turn provides the lambda function with some data it needs to do the following: ssh on to a server, stage and run a script and then hand things back off to autoscaling group to complete the scaling event.

## Pre-Requisites

[Create Nodejs Lambda Package](https://github.com/djwilkins/aws-lambda-lifecycle-hook-ssh/blob/master/create-nodejs-lambda-package.MD)

[Setup All AWS Lambda Lifecycle Hook Componants](https://github.com/djwilkins/aws-lambda-lifecycle-hook-ssh/blob/master/setup-aws-lambda-lifecycle-hook.MD)

[Other Pre-Requisites and Notes](https://github.com/djwilkins/aws-lambda-lifecycle-hook-ssh/blob/master/other-pre-reqs-and-notes.MD)
