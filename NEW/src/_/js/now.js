// TIME-AGO
const TIMEZONE = "GMT+10:00";

console.log('now.js');

function calculateTimeAgo(date) {
	const seconds = Math.floor((new Date() - date) / 1000);

	if (seconds < 0) return 'in the future';

	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) return interval + ' years ago';

	interval = Math.floor(seconds / 2592000);
	if (interval > 12) return 'a year ago';
	if (interval > 1) return interval + ' months ago';

	interval = Math.floor(seconds / 86400);
	if (interval > 28) return 'a month ago';
	if (interval > 1) return interval + ' days ago';

	interval = Math.floor(seconds / 3600);
	if (interval > 24) return 'a day ago';
	if (interval > 1) return interval + ' hours ago';

	interval = Math.floor(seconds / 60);
	if (interval > 60) return 'an hour ago';
	if (interval > 1) return interval + ' minutes ago';

	if (seconds > 60) return 'a minute ago';
	return 'just now';
};

async function getNowPosts() {
	let data = await fetch('/now.txt').then(res => res.text());
	data = data.replace(/\r/, '').split('\n');

	// Get latest
	var latestPost = data.slice(-1)[0];
	updateBubble(latestPost);

	return data;
}

function getTimeAgo(time) {
	if (isNaN(Date.parse(time))) {
		// Firefox doesn't like dash delimiters.
		time = time.replaceAll('-','/');
	}
	var timeago = Date.parse(time + TIMEZONE);
	var result = calculateTimeAgo(timeago);
	return result;
}

function updateBubble(post) {
	var [time, post] = post.split('|');
	console.log(time, post);
	var timeAgo = getTimeAgo(time);
	var bubblePost = document.getElementById('newsBubble');
	var bubbleDate = document.getElementById('newsDate');
	bubblePost.innerText = post;
	bubbleDate.innerText = timeAgo;
}

getNowPosts();

async function hydrateNowPosts() {
  let data = await getNowPosts();
  const article = document.getElementById('nowposts');

  data = data.reverse();

  for (post of data) {
    let elem = document.createElement('p');
    elem.classList.add('nowPost');

    let dateElem = document.createElement('date');
    dateElem.classList.add('nowPostDate');

    var [time, text] = post.split('|');
    var timeAgo = getTimeAgo(time);

    elem.innerText = text.trim();
    dateElem.innerText = timeAgo;
    elem.appendChild(dateElem);

    article.appendChild(elem);
  }
}