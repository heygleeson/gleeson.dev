// ELEVENTY CONFIG
const { DateTime } = require("luxon");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginTOC = require('eleventy-plugin-toc');
const pluginRSS = require("@11ty/eleventy-plugin-rss");

// markdown-it + plugins
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFigures = require('markdown-it-image-figures');

module.exports = function(config) {

	// Insert Collections, Filters, Shortcodes, Custom Tags, Plugins here.
	// Collection: Design Projects
	config.addCollection("design", (api) => {
		return api.getFilteredByTags("projects", "design")
	});

	// Collection: Games Projects
	config.addCollection("games", (api) => {
		return api.getFilteredByTags("projects", "games")
	});

	// Filter: Readable Date. Converts DateObject to "01 Jul 2023"
	config.addFilter('readableDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
	});

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

	// Set parser library
	config.amendLibrary('md', (md) => {
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
			lazy: true,
			async: true,
			figcaption: 'alt'
		});

	});

	// Return config options
	return {
		markdownTemplateEngine: 'njk',
		dir: {
			input: "src",
			output: "build"
		}
	}
};