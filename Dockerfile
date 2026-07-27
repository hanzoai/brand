# brand.hanzo.ai — the brand guide page, served by hanzoai/static (a Go binary
# on scratch) behind hanzoai/ingress. No nginx, no GitHub Pages, no CF Pages:
# the site is an image the operator runs like every other Hanzo surface.
#
# index.html is the whole site: one self-contained page, inline CSS, no scripts
# and no local subresources. There is nothing to build, so there is no build
# stage — a compile step here would exist only to look like the others.
FROM ghcr.io/hanzoai/static:v0.5.1
COPY index.html /public/index.html
