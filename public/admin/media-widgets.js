// public/admin/custom-widgets.js

import CMS from 'decap-cms-app';
import { Widget as StringWidget } from 'decap-cms-widget-string';

const insertEmbedCode = (embedCode, content, importName) => {
  const importStatement = `import { ${importName} } from 'astro-embed';`;
  if (!content.includes(importStatement)) {
    return `${importStatement}\n\n${embedCode}`;
  }
  return `${embedCode}`;
};

const YouTubeControl = StringWidget.control.extend({
  render() {
    return (
      <input
        type="text"
        value={this.props.value || ''}
        onChange={(e) => this.props.onChange(insertEmbedCode(`<YouTube id="${e.target.value}" />`, this.props.value, 'YouTube'))}
        placeholder="Enter YouTube video ID"
      />
    );
  },
});

const TweetControl = StringWidget.control.extend({
  render() {
    return (
      <input
        type="text"
        value={this.props.value || ''}
        onChange={(e) => this.props.onChange(insertEmbedCode(`<Tweet id="${e.target.value}" />`, this.props.value, 'Tweet'))}
        placeholder="Enter Tweet ID"
      />
    );
  },
});

const VimeoControl = StringWidget.control.extend({
  render() {
    return (
      <input
        type="text"
        value={this.props.value || ''}
        onChange={(e) => this.props.onChange(insertEmbedCode(`<Vimeo id="${e.target.value}" />`, this.props.value, 'Vimeo'))}
        placeholder="Enter Vimeo video ID"
      />
    );
  },
});

CMS.registerWidget('youtube', YouTubeControl);
CMS.registerWidget('tweet', TweetControl);
CMS.registerWidget('vimeo', VimeoControl);