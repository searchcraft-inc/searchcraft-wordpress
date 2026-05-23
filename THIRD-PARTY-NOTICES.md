# Third-Party Notices

## Chart.js

| Field    | Value |
|----------|-------|
| Version  | 4.4.4 |
| License  | MIT |
| Upstream | https://www.chartjs.org |
| File     | `public/vendor/chartjs/chart.umd.min.js` |
| SHA-256  | `b38076762f7363bc9e912b68b8e034826798db5df26bb61f000ec2e7a3137bc7` |

License text: see `public/vendor/chartjs/LICENSE.txt`.

Note: the minified source contains a documentation URL referencing `jsdelivr.com` (a comment
about SRI usage). This is a string literal in the bundle — no runtime CDN load occurs.

### Bump procedure

1. Download the new `chart.umd.min.js` from the Chart.js GitHub releases page.
2. Verify the hash: `shasum -a 256 public/vendor/chartjs/chart.umd.min.js`
3. Compute the SRI base64: `openssl dgst -sha256 -binary chart.umd.min.js | openssl base64`
4. Update the SHA-256 entry in this file.
5. Update the `integrity` attribute in `admin/class-searchcraft-admin.php`
   (search for `chartjs` to find the `add_chartjs_integrity_attr` method).
6. Update the version string in `wp_enqueue_script` in the same file.
7. Commit the new vendored file, this NOTICES update, and the class change together.
