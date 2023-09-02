// ------------------------------------------------------------------------- //
// THEME TOGGLE
const buttonLight = document.getElementById('lightToggle');
const lightIcon = document.getElementById('lighticon');
const emblem = document.getElementById('emblem');

if (theme == 'system') {
	theme = (window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
}

document.documentElement.dataset.theme = theme;
setTheme(theme);

function setTheme(theme) {
	document.documentElement.dataset.theme = theme;

	// Update Icons/Emblems
	if (theme == 'light') {
		lightIcon.classList.add('fa-moon');
		emblem.src = '/img/Emblem_Black_100px.png';
	} else {
		lightIcon.classList.remove('fa-moon');
		emblem.src = '/img/Emblem_White_100px.png';
	}
}

buttonLight.addEventListener('click', () => {
	theme = (theme == 'light') ? 'dark' : 'light';
	localStorage.setItem('theme', theme);
	setTheme(theme);
});

// ------------------------------------------------------------------------- //
// SCROLL INDICATOR
var scrollItems = [];
var lastItem = null;
var lastNav = null;
function getSectionHeaders() {
	var headers = [];
	var main = document.getElementsByTagName('main')[0];
	var headers = main.querySelectorAll('h2, h3, h4');
	return Array.from(headers);
}

function getNavHeaders() {
	var headers = [];
	var subnav = document.getElementById('subNav');
	var toc = subnav.querySelector('[class=toc]');
	if (!toc) return headers;
	
	headers = toc.getElementsByTagName('li');
	return Array.from(headers);
}

function getLinkedNav(headerItem) {
	var headerId = '#' + headerItem.id;
	for (navHeader of navHeaders) {
		var link = navHeader.getElementsByTagName('a')[0].getAttribute('href');
		if (link == headerId) {
			return navHeader;
		}
	}
}

var postHeaders = getSectionHeaders();
var navHeaders = getNavHeaders();

const SCROLL_OFFSET = 8;

document.addEventListener('scroll', () => {
	var scrollTop = window.scrollY + SCROLL_OFFSET;

	var pastItems = postHeaders.filter(x => x.offsetTop < scrollTop);
	if (pastItems.length === 0) return;

	var currentItem = pastItems.pop(); // Get last index.

	if (lastItem != currentItem) {
		var currentNav = getLinkedNav(currentItem);

		if (lastItem) lastItem.classList.remove('active');
		currentItem.classList.add('active');
		lastItem = currentItem;

		if (lastNav) lastNav.classList.remove('toc-active');
		currentNav.classList.add('toc-active');
		lastNav = currentNav;
	}
});

