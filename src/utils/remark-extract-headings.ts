import { visit } from 'unist-util-visit';

export interface Heading {
  depth: number;
  value: string;
}

export function extractHeadings() {
  return (tree, file) => {
    const headings: Heading[] = [];

    visit(tree, 'heading', (node) => {
      const depth = node.depth;
      const value = node.children
        .filter((child) => child.type === 'text')
        .map((child) => child.value)
        .join('');

      headings.push({ depth, value });
    });

    file.data.headings = headings;
  };
}