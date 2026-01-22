import CMS from 'decap-cms-app';

const insertEmbedCode = (embedCode, content, importName) => {
  const importStatement = `import { ${importName} } from 'astro-embed';`;
  if (!content.includes(importStatement)) {
    const frontmatterEndIndex = content.indexOf('---', 3) + 3;
    return `${content.slice(0, frontmatterEndIndex)}\n\n${importStatement}\n\n${content.slice(frontmatterEndIndex)}\n\n${embedCode}`;
  }
  return `${content}\n\n${embedCode}`;
};

CMS.registerEditorComponent({
  id: 'youtube',
  label: 'YouTube',
  fields: [{ name: 'id', label: 'YouTube Video ID', widget: 'string' }],
  pattern: /^<YouTube id="(\S+)" \/>$/,
  fromBlock: (match) => ({
    id: match[1],
  }),
  toBlock: (obj, content) => insertEmbedCode(`<YouTube id="${obj.id}" />`, content, 'YouTube'),
  toPreview: (obj) => `<YouTube id="${obj.id}" />`,
});

CMS.registerEditorComponent({
  id: 'tweet',
  label: 'Tweet',
  fields: [{ name: 'id', label: 'Tweet ID', widget: 'string' }],
  pattern: /^<Tweet id="(\S+)" \/>$/,
  fromBlock: (match) => ({
    id: match[1],
  }),
  toBlock: (obj, content) => insertEmbedCode(`<Tweet id="${obj.id}" />`, content, 'Tweet'),
  toPreview: (obj) => `<Tweet id="${obj.id}" />`,
});

CMS.registerEditorComponent({
  id: 'vimeo',
  label: 'Vimeo',
  fields: [{ name: 'id', label: 'Vimeo Video ID', widget: 'string' }],
  pattern: /^<Vimeo id="(\S+)" \/>$/,
  fromBlock: (match) => ({
    id: match[1],
  }),
  toBlock: (obj, content) => insertEmbedCode(`<Vimeo id="${obj.id}" />`, content, 'Vimeo'),
  toPreview: (obj) => `<Vimeo id="${obj.id}" />`,
});
