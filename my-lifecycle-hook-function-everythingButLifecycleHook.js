
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
// const as = new AWS.AutoScaling({apiVersion: '2011-01-01'});
const SSH = require('simple-ssh');

exports.handler = function(event, context, callback) {

    // Initial Definition of All Variables

    // Log receipt of triggering SNS notification and save data to variable:
    // console.log("INFO: request Recieved.\nDetails:\n", JSON.stringify(notification));
    // const message = JSON.parse(notification.Records[0].Sns.Message);

    // Capture ec2 instance ID from notification to use to retrieve IP:
    // const myInstanceId = message.EC2InstanceId;
    const myInstanceId = 'i-0451ad30f54fb58cc'; // Full version of script sets dynamically (see line above)

    // Configure s3 param variables of pem key file to ssh into server with:
    const myKeyBucket = process.env.myKeyBucket; // pulled from lambda env variable
    const myKey = process.env.myKey; // pulled from lambda env variable

    // Configure SSH for use below:
    let myHost = ''; // Will update with ec2 describe instance info.
    const myUser = 'ec2-user';
    let myKeyValue = ''; // Will update with s3 object contents.

    // Configure s3 param variables for script to stage and run on server:
    const myScriptBucket = process.env.myScriptBucket; // pulled from lambda env variable
    const myScript = process.env.myScript; // pulled from lambda env variable

    // This lambda function uses a promise chain to get all data needed
    // For and before initiating SSH connection below.

    // Call first function in promise chain:

    getIpFromInstanceId();


    // Define All Functions

    // This function uses ec2 describe instance to get IP from Instance ID (captured above):

    function getIpFromInstanceId() {

        const ec2Params = {
            DryRun: false,
            InstanceIds: [`${myInstanceId}`]
        };

        var request = ec2.describeInstances(ec2Params, function(err, data) {
            if (err) {
              console.log("Error", err.stack);
            } else {
              console.log("Success", JSON.stringify(data.Reservations[0].Instances[0].PrivateIpAddress));
            }
        });

        // Define promise to hold on receipt of IP value before trying to use it.
        var ec2Promise = request.promise();

        // handle promise's fulfilled/rejected states

        ec2Promise.then(
            function(data) {
                // parse out IP from ec2 describe instance returns and save to myHost variable
                // Then remove nesting double quotes from value:
                myHost = JSON.stringify(data.Reservations[0].Instances[0].PrivateIpAddress);
                myHost = myHost.replace(/["]+/g, '');
                stageObjFromS3(); // Call next function in promise chain
            },
            function(error) {
                console.log("This error is occuring with promise:", error);
            }
        );
    }

    // This function pulls a pem key file from an s3 bucket:

    function stageObjFromS3() {

        console.log("Successfully pulled following IP for ec2 instance: ", myHost);

        var params = {
            Bucket: `${myKeyBucket}`,
            Key: `${myKey}`
        };

        var request = s3.getObject(params, function(err, data) { 
            if (err) {
                console.error(err.code, "-", err.message);
                return callback(err);   }
            else {
                console.log("Success!", data); 
                }
            });

        var promise = request.promise();

        // If s3 object acquired, call sshAndRunScript to SSH with it.
        promise.then(
            function(data) {
                sshAndRunScript(data);
            },
            function(error) {
                console.log("This error is occuring with promise:", error);
            }
        );

    }

    // This function uses the data from two functions above
    // and uses SSH to get on server, s3 copy down and run script
    // On SSH connection close (script completion), it calls the final function below.

    function sshAndRunScript(data) {

        // Pull body text of pem key file into variable:
        myKeyValue = data.Body.toString('ascii');

        // Instantiate new SSH connection object:
        const ssh = new SSH({
            host: `${myHost}`,
            user: `${myUser}`,
            key:  `${myKeyValue}`
        });

        // Use SSH object to get on server, stage and run script:
        ssh.on("close", function(){completeTermLifecycle();});
        ssh.exec(`aws s3 cp s3://${myScriptBucket}/${myScript} /home/ec2-user/; chmod 700 /home/ec2-user/${myScript}; sudo /home/ec2-user/${myScript}`, {
            out: function(stdout) {
                console.log("This is me outputting the ssh action result:", stdout);
            }
        }).start();

    }

    // This is the final function in the lambda script.
    // It tells autoscale to complete the termination lifecycle.

    function completeTermLifecycle() {

        console.log("Starting completeTermLifecycle function...");

        // Define lifecycle parameters from SNS derived message object values:
        /*
        const lifecycleParams = {
            "AutoScalingGroupName" : message.AutoScalingGroupName,
            "LifecycleHookName" : message.LifecycleHookName,
            "LifecycleActionToken" : message.LifecycleActionToken,
            "InstanceId" : message.EC2InstanceId,
            "LifecycleActionResult" : "CONTINUE"
        };

        // Let Autoscale know to complete termination life cycle action:
        as.completeLifecycleAction(lifecycleParams, function(err, data){
            if (err) {
                console.log("ERROR: AS lifecycle completion failed.\nDetails:\n", err);
                console.log("DEBUG: CompleteLifecycleAction\nParams:\n", lifecycleParams);
            } else {
                console.log("INFO: CompleteLifecycleAction Successful.\nReported:\n", data);
            }
        });
        */

    }

};
