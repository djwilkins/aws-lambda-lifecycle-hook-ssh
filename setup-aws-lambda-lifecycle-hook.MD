# Setup All AWS Lambda Lifecycle Hook Componants
Follow Steps 1-7 from AWS official blog [here](https://aws.amazon.com/blogs/compute/using-aws-lambda-with-auto-scaling-lifecycle-hooks/) to setup all aws componants needed for lifestyle hooks.

Keep notes of componants (name, arn) as you go as will need for later steps.

### Modifications to Steps Above for this Lambda Function

1. None
2. None.
3. Lambda IAM Role needs two additional policies than inline policy in tutorial:
    * AmazonS3ReadOnlyAccess
    * AWSLambdaVPCAccessExecutionRole (manages interfaces for connecting to your other VPC resources)
      * https://docs.aws.amazon.com/lambda/latest/dg/vpc.html
4. None - but a couple notes:
    * Have to do this through AWS CLI to associate with notification target SNS (can't do through GUI)
    * Do this for each autoscaling group you want calling lambda function.
5. A few adjustments here:
   1. Configure your lambda function to run in your VPC and in one or more public subnets
      * Your function needs to be run in your VPC and in a public subnet to reach all AWS services not local to your personal VPC (ex. s3)
   2. Set lambda function timeout high enough for the script you'll have it stage and run on your scaling server to complete before timeout.
   3. Set the four lambda Environment variables that are pulled into the script for the s3 staged pem file and script to run on scaling server.
