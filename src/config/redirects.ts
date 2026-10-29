/**
 * Permanent redirects for web routes that have moved. Entries are never
 * removed: old URLs live on in bookmarks, search indexes and shared links.
 *
 * The AWS sheets were first published as `aws/<service>.md`, so the web
 * served them at `/aws/<service>/` while their PDFs (footer and cover QR
 * code) printed `/aws/aws-<service>/` from the slug. Slugs are permanent,
 * so the files were renamed to match them and the old web paths redirect.
 * The linter's `path-slug` rule stops the mismatch from recurring.
 */
export const REDIRECTS: Record<string, string> = {
  '/aws/api-gateway': '/aws/aws-api-gateway/',
  '/aws/cloudfront': '/aws/aws-cloudfront/',
  '/aws/lambda': '/aws/aws-lambda/',
  '/aws/msk': '/aws/aws-msk/',
  '/aws/s3': '/aws/aws-s3/',
};
