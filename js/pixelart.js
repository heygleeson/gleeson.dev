// HELLO

function integerScale() {
	console.log("PIXEL ART");
	var images = document.getElementsByClassName('pixel'); 
	for (image of images) {
		parent = image.parentElement;
		const w = image.naturalWidth;
		const h = image.naturalHeight;
		const scale = Math.min(Math.max( Math.ceil(parent.clientWidth / w), Math.ceil(parent.clientHeight / h), 1));
		image.width = w * scale;
		image.height = h * scale;
		image.style.top = - ((h * scale) * 0.25) + "px";
	}
}

window.onload = integerScale;
window.onresize = integerScale;