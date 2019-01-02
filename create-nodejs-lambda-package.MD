# Create Nodejs Lambda Package
Since AWS Lambda runtimes lack ssh, this script requires the use of the nodejs library "simple-ssh".  To get this into the lambda runtime, it must first be staged and packaged up using the following steps.

### Installed Node 8.10 on an EC2 Instance

1) logged on to EC2 instance
2) curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
3) logged off and ssh'd back on
4) nvm install 8.10

Source (steps 2-4): https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html:

### Creating Node 8.10 dev package for lambda

#### Stage Simple-SSH Library

1) cd /home/ec2-user/
2) mkdir my-folder-name
3) cd my-folder-name
3) npm init -y
4) npm install simple-ssh --save   # or whatever npm package of interest
5) stage your js script in the folder too:
    * Can save any one of js flies here as index.js folder to start.
    * And modify later for testing and final version through lambda in gui.
6) verify you're directory contents look like this:
Example of what you'll have in the folder to zip up:
index.js
node_modules
package.json
package-lock.json

#### Zip Up Directory Contents

1) cd into directory # cd /home/ec2-user/my-folder-name/
2) zip -r /home/ec2-user/roll-a-dice.zip *
(-r is recusrive, without it zip will have empty node_modules folder)

### Copy Dev Package Up to S3

1) aws s3 cp /home/ec2-user/simple-ssh-package.zip s3://my-lambda-zip-files/
You can now import the zip into your aws nodejs 8.10 lambda function once created

Source: https://dev.to/adnanrahic/getting-started-with-aws-lambda-and-nodejs-1kcf


