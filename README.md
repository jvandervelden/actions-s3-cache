# actions-s3-cache

This action cache files in S3. A `key` determines a set of files to load and unload. The `key` will be the name of a
file that's uploaded to S3.

## Usage

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: bitnomial/actions-s3-cache@v1.0.1
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_DEFAULT_REGION: us-east-1
    with:
      s3-bucket: your-s3-bucket-name # required
      key: npm-v1-${{github.base_ref}}-${{ hashFiles('laravel/package-lock.json') }} # required
      paths: node_modules # required 
      dir: ~ # Not required! Defaults to workspace
```

## IAM Policy Example

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
            ],
            "Resource": [
                "arn:aws:s3:::your-s3-bucket-name",
                "arn:aws:s3:::your-s3-bucket-name/*"
            ]
        }
    ]
}
```
## License

[MIT License](https://github.com/bitnomial/actions-s3-cache/blob/master/LICENCE) - Copyrights (c) 2020 shonansurvivors, Bitnomial
