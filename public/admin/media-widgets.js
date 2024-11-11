import CMS from 'decap-cms-app';

const insertEmbedCode = (embedCode, content, importName) => {
  const importStatement = `import { ${importName} } from 'astro-embed';`;
  if (!content.includes(importStatement)) {
    return `${importStatement}\n\n${embedCode}`;
  }
  return `${embedCode}`;
};

CMS.registerEditorComponent({
  id: 'youtube',
  label: 'YouTube',
  fields: [{ name: 'id', label: 'YouTube Video ID', widget: 'string' }],
  pattern: /^<YouTube id="(\S+)" \/>$/,
  fromBlock: (match) => ({
    id: match[1],
  }),
  toBlock: (obj) => `<YouTube id="${obj.id}" />`,
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
  toBlock: (obj) => `<Tweet id="${obj.id}" />`,
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
  toBlock: (obj) => `<Vimeo id="${obj.id}" />`,
  toPreview: (obj) => `<Vimeo id="${obj.id}" />`,
});