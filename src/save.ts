import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as glob from "@actions/glob";
import * as path from "path";
import * as fs from "fs";
import * as AWS from "aws-sdk";

export async function resolvePaths(dir: string, patterns: string[]): Promise<string> {
  const paths: string[] = [];
  const workspace = dir ?? process.env['GITHUB_WORKSPACE'] ?? process.cwd();
  const globber = await glob.create(patterns.join('\n'), {
    implicitDescendants: false
  });

  for await (const file of globber.globGenerator()) {
    const relativeFile = path.relative(workspace, file);
    core.debug(`Matched: ${relativeFile}`);
    // Paths are made relative so the tar entries are all relative to the root of the workspace.
    paths.push(`${relativeFile}`);
  }

  return paths.join(' ');
}

function getInputAsArray(
    name: string,
    options?: core.InputOptions
): string[] {
    return core
        .getInput(name, options)
        .split("\n")
        .map(s => s.trim())
        .filter(x => x !== "");
}

async function run(): Promise<void> {

  try {
    const s3Bucket = core.getInput('s3-bucket', { required: true });

    const cacheKey = core.getInput('key', { required: true });
    const fileName = cacheKey + '.tar.zst';

    const dir = core.getInput('dir', { required: false });
    core.info(`Dir: ${dir}`);
    if (dir) {
      process.chdir(dir);
    }

    const paths = getInputAsArray('paths', { required: true });
    const cachePaths = await resolvePaths(dir, paths);

    const s3 = new AWS.S3();

    await exec.exec(`tar --use-compress-program zstd -cf ${fileName} ${cachePaths}`);

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
