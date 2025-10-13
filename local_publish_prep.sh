#!/bin/bash

# Script to copy current directory contents to sibling "searchcraft" directory
# and clean up .DS_Store files and vendor/bin directory

set -e  # Exit on any error

# Get the current directory name and parent directory
CURRENT_DIR=$(basename "$(pwd)")
PARENT_DIR=$(dirname "$(pwd)")
TARGET_DIR="$PARENT_DIR/searchcraft"

echo "Copying contents from $CURRENT_DIR to searchcraft directory..."

# Create the target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy all contents from current directory to target directory
# Using rsync for better handling of symlinks and permissions
rsync -av --exclude='.git' . "$TARGET_DIR/"

echo "Copy completed successfully!"

# Remove all .DS_Store files from the target directory
echo "Removing .DS_Store files..."
find "$TARGET_DIR" -name ".DS_Store" -type f -delete

# Remove vendor/bin directory if it exists
if [ -d "$TARGET_DIR/vendor/bin" ]; then
    echo "Removing vendor/bin directory..."
    rm -rf "$TARGET_DIR/vendor/bin"
fi

# Remove tests directory if it exists
if [ -d "$TARGET_DIR/tests" ]; then
    echo "Removing tests directory..."
    rm -rf "$TARGET_DIR/tests"
fi

# Remove scripts directory if it exists
if [ -d "$TARGET_DIR/scripts" ]; then
    echo "Removing scripts directory..."
    rm -rf "$TARGET_DIR/scripts"
fi

# Remove icon and banner files from assets directory if it exists
if [ -d "$TARGET_DIR/assets" ]; then
    echo "Removing icon and banner images from assets dir..."
    rm -rf "$TARGET_DIR/assets/icon"*
    rm -rf "$TARGET_DIR/assets/banner"*
fi
if [ -d "$TARGET_DIR/vendor/dealerdirect" ]; then
    echo "Removing php stubs directory..."
    rm -rf "$TARGET_DIR/vendor/dealerdirect"
fi
if [ -d "$TARGET_DIR/vendor/phpcsstandards" ]; then
    echo "Removing php stubs directory..."
    rm -rf "$TARGET_DIR/vendor/phpcsstandards"
fi
if [ -d "$TARGET_DIR/vendor/php-stubs" ]; then
    echo "Removing php stubs directory..."
    rm -rf "$TARGET_DIR/vendor/php-stubs"
fi
if [ -d "$TARGET_DIR/vendor/squizlabs" ]; then
    echo "Removing php stubs directory..."
    rm -rf "$TARGET_DIR/vendor/squizlabs"
fi
if [ -d "$TARGET_DIR/vendor/wp-coding-standards" ]; then
    echo "Removing php stubs directory..."
    rm -rf "$TARGET_DIR/vendor/wp-coding-standards"
fi
rm -rf "$TARGET_DIR/local_publish_prep.sh"
rm -rf "$TARGET_DIR/.github"
rm -rf "$TARGET_DIR/.gitignore"
rm -rf "$TARGET_DIR/.vscode"
rm -rf "$TARGET_DIR/intelephense.json"
echo "Cleanup completed!"
echo "Contents copied to: $TARGET_DIR"
