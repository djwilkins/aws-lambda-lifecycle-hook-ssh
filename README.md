# aws-lambda-lifecycle-hook-ssh
This aws lambda function (node js) works when triggered by an autoscaling lifecycle hook.  The autoscaling hook here indirectly kicks off the lambda function through an SNS topic update, which in turn provides the lambda function with some data it needs to do the following: ssh on to a server, stage and run a script and then hand things back off to autoscaling group to complete the scaling event.

## Pre-Requisites

Create Nodejs Lambda Package

Setup All AWS Lambda Lifecycle Hook Componants

Other Pre-Requisites
