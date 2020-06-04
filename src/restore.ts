import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as AWS from "aws-sdk";
import * as fs from "fs";

async function run(): Promise<void> {

  try {
    const s3Bucket = core.getInput('s3-bucket', { required: true });
    const cacheKey = core.getInput('key', { required: true });
    const tarball = cacheKey + '.tar.bz2';

    const s3 = new AWS.S3();

    s3.getObject({
        Bucket: s3Bucket,
        Key: tarball
      }, async (err, data) => {
        if (err) {
          core.info(`No cache is found for key: ${tarball}`);
        } else {
          core.info(`Found a cache for key: ${tarball}`);
          fs.writeFileSync(tarball, data.Body);

          await exec.exec(`tar xjf ${tarball}`);
          await exec.exec(`rm -f ${tarball}`);
        }
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

export default run;
