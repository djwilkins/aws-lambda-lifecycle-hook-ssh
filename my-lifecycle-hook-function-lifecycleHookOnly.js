
const AWS = require('aws-sdk');
// const s3 = new AWS.S3({apiVersion: '2006-03-01'});
// const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const as = new AWS.AutoScaling({apiVersion: '2011-01-01'});
// const SSH = require('simple-ssh');

exports.handler = function (notification, context, callback) {

    // Initial Definition of All Variables

    // Log receipt of triggering SNS notification and save to variable:
    console.log("INFO: request Recieved.\nDetails:\n", JSON.stringify(notification));
    const message = JSON.parse(notification.Records[0].Sns.Message);

    // Define lifecycle parameters from SNS derived message variable:
    const lifecycleParams = {
        "AutoScalingGroupName" : message.AutoScalingGroupName,
        "LifecycleHookName" : message.LifecycleHookName,
        "LifecycleActionToken" : message.LifecycleActionToken,
        "InstanceId" : message.EC2InstanceId,
        "LifecycleActionResult" : "ABANDON"
    };

    console.log("Defined lifecycleParams: ", lifecycleParams);

    // Let Autoscale know to complete termination life cycle action:
    as.completeLifecycleAction(lifecycleParams, function(err, data){
        if (err) {
            console.log("ERROR: AS lifecycle completion failed.\nDetails:\n", err);
            console.log("DEBUG: CompleteLifecycleAction\nParams:\n", lifecycleParams);
        } else {
            console.log("INFO: CompleteLifecycleAction Successful.\nReported:\n", data);
        }
    });


};
