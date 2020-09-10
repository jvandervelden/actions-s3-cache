import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import { CompressionType, getCompressionType } from "./compression";

async function run(): Promise<void> {

  try {
    const s3Bucket = core.getInput('s3-bucket', { required: true });
    const cacheKey = core.getInput('key', { required: true });
    const paths = core.getInput('paths', { required: true });
    const compression = core.getInput('compression', { required: true });
    const compressionType: CompressionType = getCompressionType(compression);
    const fileName = `${cacheKey}.tar.${compressionType.fileExt}`;
    
    const s3 = new AWS.S3();

    await exec.exec(`tar ${compressionType.tarOption} -cf ${fileName} ${paths}`);

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
