# Plugin Header Updater

This script automatically updates the WordPress plugin header in `searchcraft.php` based on the information in `readme.txt`.

## Usage

### Manual execution

```bash
php scripts/class-update-plugin-header.php
```

### Via Composer

```bash
composer class-update-plugin-header
```

### Automatic execution

The script is configured to run automatically after `composer update` via the `post-update-cmd` hook.

## What it does

The script parses the `readme.txt` file and extracts the following information:

- **Plugin Name**: From the first line (e.g., `=== Searchcraft ===`)
- **Plugin URI**: From the "Donate link" field
- **Description**: From the first description line after the header
- **Version**: From the "Stable tag" field
- **Author**: From the "Contributors" field
- **License**: From the "License" field (converted to WordPress format if needed)
- **License URI**: From the "License URI" field

It then updates the WordPress plugin header in `searchcraft.php` with this information.

## Mapping

| readme.txt field | Plugin header field |
|------------------|-------------------|
| Plugin name (first line) | Plugin Name |
| Donate link | Plugin URI |
| First description line | Description |
| Stable tag | Version |
| Contributors | Author |
| License | License |
| License URI | License URI |

## Default values

If any field is missing from readme.txt, the script uses these defaults:

- **Plugin Name**: "Searchcraft"
- **Plugin URI**: "https://searchcraft.io"
- **Description**: "Bring fast, relevant search to your WordPress site."
- **Version**: "1.0.0"
- **Author**: "Searchcraft"
- **Author URI**: "https://searchcraft.io/"
- **License**: "Apache 2.0"
- **License URI**: "http://www.apache.org/licenses/LICENSE-2.0.txt"
- **Text Domain**: "searchcraft"
- **Domain Path**: "/languages"

## License handling

The script intelligently handles license URIs based on the license type:

- **Apache 2.0**: Uses `http://www.apache.org/licenses/LICENSE-2.0.txt`
- **GPL licenses**: Uses `http://www.gnu.org/licenses/gpl-2.0.txt`
- **Other licenses**: Defaults to GPL license URI

The script preserves the exact license specified in readme.txt without conversion.

## Benefits

1. **Single source of truth**: Maintain plugin information in readme.txt only
2. **Consistency**: Ensures plugin header matches readme.txt
3. **Automation**: Runs automatically during composer updates
4. **Error prevention**: Reduces manual editing errors
5. **License preservation**: Respects the license type specified in readme.txt
