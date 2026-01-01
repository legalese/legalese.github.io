# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Legalese (legalese.com), built with Jekyll and hosted on GitHub Pages. Originally launched around 2019/2020, revised in 2025/2026 to showcase the L4 programming language for computational law, developed over five years at SMU and brought to market by Legalese.

## Build Commands

```bash
# Build the site (output goes to _site/)
jekyll build

# Build with watch mode for development
jekyll build -w

# Run broken link checker (requires site running on localhost)
npm test
```

Note: You don't need to run the build locally before committing - GitHub Pages builds automatically on push.

## Architecture

- **Jekyll static site**: Uses `_layouts/default.html` as the main template containing navigation and footer
- **Pages**: HTML files in root directory with Jekyll front matter (`layout: default`)
- **Includes**: Reusable components in `_includes/` (forms, navigation sections, etc.)
- **Styling**: CSS in `css/` directory, uses Bootstrap 4.4.1 with custom styles in `landingpage.css`
- **Scripts**: JavaScript in `scripts/` directory

## Key Files

- `_layouts/default.html`: Master layout with navigation bars and footer
- `index.html`: Homepage promoting L4 language and linking to web IDE
- `_config.yml`: Jekyll configuration (minimal - just excludes readme.md)

## External Links

The site links to the L4 ecosystem:
- Web IDE: https://jl4.legalese.com/
- Documentation: https://l4.legalese.com/
- GitHub: https://github.com/legalese/l4-ide
