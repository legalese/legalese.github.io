#!/bin/bash

# Fetch L4 documentation and highlightjs-l4 assets at build time
# Uses sparse checkout to avoid GitHub API rate limits

set -e  # Exit on error

# =============================================================================
# L4 Documentation (from l4-ide repo)
# =============================================================================

L4_REPO_URL="https://github.com/smucclaw/l4-ide.git"
L4_BRANCH="thomasgorissen/documentation-v2"
DOC_DIR=".l4-docs"

echo "Fetching L4 documentation..."

# Remove existing docs directory
rm -rf "$DOC_DIR"

# Create a new directory and initialize sparse checkout
mkdir -p "$DOC_DIR"
cd "$DOC_DIR"

git init --quiet
git remote add origin "$L4_REPO_URL"

# Configure sparse checkout to only get the doc folder
git config core.sparseCheckout true
echo "doc/" > .git/info/sparse-checkout

# Fetch only the specific branch with minimal depth
# Use full ref path for branches with slashes in the name
git fetch --quiet --depth 1 origin "refs/heads/$L4_BRANCH:refs/remotes/origin/$L4_BRANCH"
git checkout --quiet "origin/$L4_BRANCH"

echo "L4 documentation fetched successfully to .l4-docs/doc"

# Return to project root
cd ..

# =============================================================================
# Copy image files to public/doc-images
# =============================================================================

echo "Copying image files from .l4-docs/doc to public/doc-images..."

mkdir -p public/doc-images

# Find and copy all image files (png, jpg, jpeg, gif, svg, webp) from .l4-docs/doc to public/doc-images
find .l4-docs/doc -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.svg" -o -iname "*.webp" \) -exec cp {} public/doc-images/ \;

echo "Image files copied successfully!"

# =============================================================================
# Highlight.js L4 Language Support (from highlightjs-l4 repo)
# =============================================================================

HLJS_REPO_URL="https://github.com/legalese/highlightjs-l4.git"
HLJS_BRANCH="main"
HLJS_TEMP_DIR=".hljs-l4-temp"
HLJS_OUTPUT_DIR="public/hljs-l4"

echo "Fetching highlight.js L4 language support..."

# Remove existing temp and output directories
rm -rf "$HLJS_TEMP_DIR"
rm -rf "$HLJS_OUTPUT_DIR"

# Create temp directory and initialize sparse checkout
mkdir -p "$HLJS_TEMP_DIR"
cd "$HLJS_TEMP_DIR"

git init --quiet
git remote add origin "$HLJS_REPO_URL"

# Configure sparse checkout to only get the dist folder
git config core.sparseCheckout true
echo "dist/" > .git/info/sparse-checkout

# Fetch only the main branch with minimal depth
git fetch --quiet --depth 1 origin "$HLJS_BRANCH"
git checkout --quiet FETCH_HEAD

# Return to project root
cd ..

# Copy dist contents to public folder
mkdir -p "$HLJS_OUTPUT_DIR"
cp -r "$HLJS_TEMP_DIR/dist/"* "$HLJS_OUTPUT_DIR/"

# Clean up temp directory
rm -rf "$HLJS_TEMP_DIR"

echo "Highlight.js L4 files copied to $HLJS_OUTPUT_DIR"
echo "Build assets fetched successfully!"