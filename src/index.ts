const button = document.querySelector('#butonek');
const input: HTMLInputElement = document.querySelector(
  '#location'
) as HTMLInputElement;
const div = document.querySelector('#weather_container');

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = '&appid=81e564bdda8adddbc2d805694d19cdac';
const unitsType = '&units=metric';
const lang = '&lang=pl';
input.value = 'lublin';

button?.addEventListener('click', async () => {
  const location = input.value;
  if (location == null || location == '') {
    alert('Pole nie może być puste');
  } else {
    const weatherData = await getWeatherData(location);
    if (weatherData.cod == '404') {
      alert(`Nie znaleziono prognozy dla ${location}`);
    } else {
      const feels_like_span = document.createElement('span');
      feels_like_span.innerHTML = weatherData.main.feels_like;
      div?.append(feels_like_span);

      const temp_span = document.createElement('span');
      temp_span.innerHTML = weatherData.main.temp;
      div?.append(temp_span);

      const temp_max_span = document.createElement('span');
      temp_max_span.innerHTML = weatherData.main.temp_max;
      div?.append(temp_max_span);

      const temp_min_span = document.createElement('span');
      temp_min_span.innerHTML = weatherData.main.temp_min;
      div?.append(temp_min_span);

      const pressure_span = document.createElement('span');
      pressure_span.innerHTML = weatherData.main.pressure;
      div?.append(pressure_span);

      const humidity_span = document.createElement('span');
      humidity_span.innerHTML = weatherData.main.humidity;
      div?.append(humidity_span);

      const description_span = document.createElement('span');
      description_span.innerHTML = weatherData.weather[0].description;
      div?.append(description_span);

      const weather_main_span = document.createElement('span');
      weather_main_span.innerHTML = weatherData.weather[0].main;
      div?.append(weather_main_span);

      const wind_span = document.createElement('span');
      wind_span.innerHTML = weatherData.wind.speed;
      div?.append(wind_span);

      const wind_direction_span = document.createElement('span');
      wind_direction_span.innerHTML = weatherData.wind.deg;
      div?.append(wind_direction_span);

      const clouds_span = document.createElement('span');
      clouds_span.innerHTML = weatherData.clouds.all;
      div?.append(clouds_span);

      const name_span = document.createElement('span');
      name_span.innerHTML = weatherData.name;
      div?.append(name_span);
    }
    console.log(weatherData);
  }
});

async function getWeatherData(location: string) {
  const response = await fetch(
    `${baseUrl}/weather?q=${location}${unitsType}${appId}${lang}`
  );
  return response.json();
}
