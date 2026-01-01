# Legalese.com Website

Static website for [Legalese](https://legalese.com), the company bringing computational law to market through the L4 programming language.

## About

Originally launched around 2019/2020, this site was revised in 2025/2026 to showcase L4, a domain-specific language for law developed over five years at SMU CCLAW. L4 enables legal rules to be expressed as executable, type-checked code.

**Key links:**
- [L4 Web IDE](https://jl4.legalese.com/) - Try L4 in your browser
- [L4 Documentation](https://l4.legalese.com/) - Language reference and tutorials
- [legalese/l4-ide](https://github.com/legalese/l4-ide) - Core language and IDE source

## Future Work

This site needs updates to better cover:
- Productization work and commercial offerings
- Core language development at [legalese/l4-ide](https://github.com/legalese/l4-ide)

---

## Development

Built with [Jekyll](https://jekyllrb.com/docs/step-by-step/01-setup/) and hosted on GitHub Pages.

### Building locally

```bash
jekyll build -w
```

Output goes to `_site/`. You don't need to build locally before pushing - GitHub Pages builds automatically.

### Site structure

Pages use Jekyll front matter to reference `_layouts/default.html`, which contains the navigation and footer:

```
---
layout: default
---
```

Edit `_layouts/default.html` to change the navigation bars.
