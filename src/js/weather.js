// WEATHER
function getWeather() {
	// TODO : Get my own API key.
	const URL = "https://api.openweathermap.org/data/2.5/weather?q=Melbourne,AUS&appid=4d8fb5b93d4af21d66a2948710284366&units=metric";

	fetch(URL).then(res => res.json()).then(data => {
		const { main, name, sys, weather } = data;
		const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
		const elemTemp = document.getElementById('weatherTemp');
		const elemIcon = document.getElementById('weatherIcon');
		const elemDesc = document.getElementById('weatherDesc');
		elemTemp.innerText = Math.round(main["temp"]) + "°C";
		elemIcon.src = icon;
		elemDesc.innerText = weather[0]["main"];
	});
}
document.onload = getWeather();
