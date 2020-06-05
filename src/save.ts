import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as AWS from "aws-sdk";
import * as fs from "fs";

async function run(): Promise<void> {

  try {
    const s3Bucket = core.getInput('s3-bucket', { required: true });
    const cacheKey = core.getInput('key', { required: true });
    const paths = core.getInput('paths', { required: true });
    const fileName = cacheKey + '.tar.bz2';

    const dir = core.getInput('dir', { required: false });
    core.info(`Dir: ${dir}`);
    if (dir) {
      process.chdir(dir);
    }

    const s3 = new AWS.S3();

    await exec.exec(`zsh -c "tar cjf ${fileName} ${paths}"`);

    s3.upload({
        Body: fs.readFileSync(fileName),
        Bucket: s3Bucket,
        Key: fileName,
      }, (err, _data) => {
        if (err) {
          core.info(`Failed store to ${fileName}`);
        } else {
          core.info(`Stored cache to ${fileName}`);
        }
      }
    );

  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
