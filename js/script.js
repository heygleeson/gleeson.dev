function integerScale() {
	console.log("PIXEL ART");
	var images = document.getElementsByClassName('pixel'); 
	for (image of images) {
		parent = image.parentElement;
		const parentW = parent.clientWidth;
		const parentH = parent.clientHeight;
		const w = image.naturalWidth;
		const h = image.naturalHeight;
		const scale = Math.min(Math.max( Math.ceil(parentW / w), Math.ceil(parentH / h), 1));
		image.width = w * scale;
		image.height = h * scale;
		image.style.left = (parentW - (w * scale)) / 2 + "px";
		image.style.top = (parentH - (h * scale)) / 2 + "px";
	}
}

window.onload = integerScale;
window.onresize = integerScale;