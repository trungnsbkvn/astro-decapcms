import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger'
import { type MarkdownAstroData, type RehypePlugin, type RemarkPlugin } from '@astrojs/markdown-remark';

const slugger = new GithubSlugger()
export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    (file.data.astro as MarkdownAstroData).frontmatter.readingTime = readingTime;
  };
};

export const extractHeadingsRemarkPlugin: RemarkPlugin = () => {
  return (tree, file) => {
    const headings: { depth: number; text: string; slug: string }[] = [];

    visit(tree, 'heading', (node) => {
      const depth = node.depth;
      const text = node.children
        .filter((child) => child.type === 'text')
        .map((child) => child.value)
        .join('');

      const slug = slugger.slug(text);
      headings.push({ depth, text, slug });
    });

    (file.data.astro as MarkdownAstroData).frontmatter.headings = headings;
  };
}

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};
