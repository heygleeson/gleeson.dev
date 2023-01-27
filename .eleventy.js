'use strict';

// Imports
const fs = require("fs");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it"); // Markdown interpreter
const markdownItAnchor = require("markdown-it-anchor"); // Appends links to headers
const markdownTasks = require('markdown-it-task-lists') // Captures GFM Todo lists
const markdownFigures = require('markdown-it-image-figures'); // Turns Images into FigCaptions
const slugify = require('slugify'); // Slugify

// Eleventy Plugins
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight"); // Enables highlighting for code-blocks
const pluginNavigation = require("@11ty/eleventy-navigation");

const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = (config) => {
	// -------------------------------------------------------------------- //
	// Plugins
	config.addPlugin(pluginNavigation);
	config.addPlugin(pluginSyntaxHighlight);
	config.addPlugin(EleventyRenderPlugin);

	// -------------------------------------------------------------------- //
	// Filters

	// Readable Date
	config.addFilter('readableDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
	});

	config.addFilter('displayDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toFormat("yyyy.MM.dd");
	});

	config.addFilter('uppercase', (value) => value.toUpperCase());

	function filterIgnoredTags(tags) {
		const ignoreTags = ['blog'];
		return (tags || []).filter((tag) => ignoreTags.indexOf(tag) === -1).sort();
	}

	// Ignore Tags
	config.addFilter('filterIgnoredTags', filterIgnoredTags);

	// Slugify
	config.addFilter('slugify', slugify);

	// -------------------------------------------------------------------- //
	// Shortcodes


	// -------------------------------------------------------------------- //
	// Collections

	// Featured Posts
	config.addCollection('featured', (collection) => {
		return collection.getAll().filter((item) => {
			return "featured" in item.data;
		});
	});

	// All Tags
	config.addCollection('alltags', (collection) => {
		let tags = new Set();

		collection.getAll().forEach((item) => {
			(item.data.tags || []).forEach((tag) => tags.add(tag));
		});

		// Filter out ignored tags
		return filterIgnoredTags([...tags]);
	});

	// All Blog Tags
	config.addCollection('allBlogTags', (collection) => {
		let tags = new Set();

		collection.getFilteredByTags('blog').forEach((item) => {
			(item.data.tags || []).forEach((tag) => tags.add(tag));
		});

		// Filter out ignored tags
		return filterIgnoredTags([...tags]);
	});

	// Now Posts
	config.addCollection('now', (collection) => {
		let now = collection.getFilteredByTags('now');
		// let now = collection.getAll();
		//console.log("==NOW==");
		//now.forEach((x,i) => console.log("\n\nX",x.template.frontMatter, "\n\nI",i));
		return now;
	});

	// -------------------------------------------------------------------- //
	// Passthroughs (folders that get copied directly to output)

	config.addPassthroughCopy("src/img");
	config.addPassthroughCopy("src/css");
	config.addPassthroughCopy("src/fonts");
	config.addPassthroughCopy("src/js");
	config.addPassthroughCopy("src/CNAME");

	// -------------------------------------------------------------------- //
	// Miscellaneous

	// Configure Markdown Library - enables header anchors.
	let mdLibrary = markdownIt({
		html: true, 
		breaks: true, 
		linkify: true
	})
	.use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1,2,3,4],
		}),
		slugify: config.getFilter('slugify')
	})
	.use(markdownTasks)
	.use(markdownFigures, {
		figcaption: 'alt',
		lazy: true,
		async: true
	});
	
	config.setLibrary('md', mdLibrary);

	// -------------------------------------------------------------------- //
	return {
		// Default Directories
		dir : {
			input: 'src',
			data : '_data',
			includes: '_includes',
			layouts: '_includes',
			output: '_site'
		},
		// Template Engines
		templateFormats: ['md','njk','html'],
		dataTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk'
	};
}