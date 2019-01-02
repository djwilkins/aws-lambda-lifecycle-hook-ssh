# Other Pre-Reqs and Notes

### Other Pre-Reqs

* Pre-Reqs for EC2 Instances in Your Autoscaling Group(s):
    * Your EC2 Instances need to be added to your Autoscaling Groups AFTER the Lifecycle Hook is Setup for it to Apply to them.
    * They also need AWS CLI Installed for the commands run during the SSH portion of the Lambda Function to work.
        * It may be possible to configure aws cli region as additional SSH session command like this:
            * printf '\n\n[AWS-REGION-VALUE]\n\n' | aws configure
    * And they need permissions to copy down your script from your s3 bucket as performed therein.

### Other Notes

* Finding your AWS Lambda Function Logs in CloudWatch:
    * /aws/lambda/YourFunctionName
* Using Promises in AWS Nodejs Lambda Functions:
    * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html
