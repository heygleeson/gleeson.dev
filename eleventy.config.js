'use strict';


// ELEVENTY CONFIG
const { DateTime } = require("luxon");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginTOC = require('eleventy-plugin-toc');
const pluginRSS = require("@11ty/eleventy-plugin-rss");

// markdown-it + plugins
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFigures = require('markdown-it-image-figures');

module.exports = function(config) {

	// -------------------------------------------------------------------- //
	// Customised markdown library
	var md = markdownIt({html: true, breaks: true, linkify: true});
	md.use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1,2,3,4],
		}),
	});
	md.use(markdownItAttrs, {});
	md.use(markdownItFigures, {
		// lazy: true,
		// async: true,
		figcaption: 'alt'
	});
	
	// -------------------------------------------------------------------- //

	// I always want to ignore these tags
	function filterIgnoredTags(tags) {
		const ignoreTags = ['blog'];
		return (tags || []).filter((tag) => ignoreTags.indexOf(tag) === -1).sort();
	}

	// -------------------------------------------------------------------- //
	// Collections

	// All Tags
	config.addCollection('alltags', (collection) => {
		let tags = new Set();
		collection.getAll().forEach((item) => {
			(item.data.tags || []).forEach((tag) => tags.add(tag));
		});
		return filterIgnoredTags([...tags]);
	});

	// Blog Tags
	config.addCollection('blogtags', (collection) => {
		let tags = new Set();
		collection.getFilteredByTags('blog').forEach((item) => {
			(item.data.tags || []).forEach((tag) => tags.add(tag));
		});
		return filterIgnoredTags([...tags]);
	});

	// Project Tags
	config.addCollection('projecttags', (collection) => {
		let tags = new Set();
		collection.getFilteredByTags('projects').forEach((item) => {
			(item.data.tags || []).forEach((tag) => tags.add(tag));
		});
		return filterIgnoredTags([...tags]);
	});

	// -------------------------------------------------------------------- //
	// Filters

	// Filter: Readable Date. Converts DateObject to "01 Jul 2023"
	config.addFilter('readableDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
	});

	// Filter: Markdown
	config.addFilter('md', (content) => {
		return md.render(content);
	});

	// -------------------------------------------------------------------- //
	// Plugins

	// Plugin: Eleventy Navigation
	config.addPlugin(pluginNavigation);

	// Plugin: Table of Contence
	config.addPlugin(pluginTOC, {
		ul: true,
		flat: true,
		wrapper: ''
	});
	
	// Plugin: RSS
	config.addPlugin(pluginRSS);
	
	// DEV: Don't duplicate passthru folders into '/build/'
	//config.setServerPassthroughCopyBehavior("passthrough");

	// Passthrough Folders
	config.addPassthroughCopy({"src/_": "."})
	config.addPassthroughCopy("src/img")

	// Set parsing option to look for excerpts '---'
	config.setFrontMatterParsingOptions({excerpt: true})

	config.setLibrary('md', md);

	// // Set parser library
	// config.amendLibrary('md', (md) => {
	// 	md.use(markdownItAnchor, {
	// 		permalink: markdownItAnchor.permalink.ariaHidden({
	// 			placement: 'after',
	// 			class: 'direct-link',
	// 			symbol: '#',
	// 			level: [1,2,3,4],
	// 		}),
	// 	});
	// 	md.use(markdownItAttrs, {});
	// 	md.use(markdownItFigures, {
	// 		lazy: true,
	// 		async: true,
	// 		figcaption: 'alt'
	// 	});
	// });

	// Return config options
	return {
		markdownTemplateEngine: 'njk',
		dir: {
			input: "src",
			output: "build"
		}
	}
};