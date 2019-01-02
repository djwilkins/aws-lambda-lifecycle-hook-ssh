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
    * 
