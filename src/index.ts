const button = document.querySelector('#butonek');
const input: HTMLInputElement = document.querySelector(
  '#location'
) as HTMLInputElement;
const weatherContainer = document.querySelector('#weather_container');
const locationContainer = document.querySelector('#location_list');

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = '&appid=81e564bdda8adddbc2d805694d19cdac';
const unitsType = '&units=metric';
const lang = '&lang=pl';
const iconString = '';
const iconBaseUrl = 'http://openweathermap.org/img/wn/';
const iconUrlBack = '@2x.png';

input.value = 'lublin';

button?.addEventListener('click', async () => {
  if (locationContainer != null) {
    locationContainer.innerHTML = '';
  }

  const location = input.value;
  input.value = '';

  if (location == null || location == '') {
    alert('Pole nie może być puste');
  } else {
    const locationData = await searchLocation(location);
    console.log('list', locationData);

    locationData.list.forEach((element: any) => {
      console.log('element', element);

      const listItemId = element.id;
      const listItemName = element.name;
      const icon = element.weather[0].icon;

      const locationButton = document.createElement('button');
      locationButton.innerHTML = element.name;
      locationContainer?.append(locationButton);

      locationButton.addEventListener('click', async () => {
        if (weatherContainer != null) {
          weatherContainer.innerHTML = '';
        }

        if (locationContainer != null) {
          locationContainer.innerHTML = '';
        }

        console.log('pobieram pogode dla: ', listItemName);
        const weatherData = await getWeatherDataFromId(listItemId);

        if (weatherData.cod == '404') {
          alert(`Nie znaleziono prognozy dla ${listItemName}`);
        } else {
          const locationElement = document.createElement('div');
          weatherContainer?.append(locationElement);
          appendWeatherData(locationElement, weatherData);
          const locationElementIcon = document.createElement('div');
          weatherContainer?.append(locationElementIcon);
          appendIcon(locationElementIcon, icon);
          console.log(icon);
        }
        console.log('weather', weatherData);
      });
    });
  }
});

async function getWeatherDataFromId(listItemId: string) {
  const responseId = await fetch(
    `${baseUrl}/weather?id=${listItemId}${unitsType}${appId}${lang}`
  );
  return responseId.json();
}

async function getWeatherData(location: string) {
  const response = await fetch(
    `${baseUrl}/weather?q=${location}${unitsType}${appId}${lang}`
  );
  return response.json();
}

async function searchLocation(location: string) {
  const response = await fetch(
    `${baseUrl}/find?q=${location}${unitsType}${appId}${lang}`
  );
  return response.json();
}

function appendIcon(div: HTMLDivElement, icon: string) {
  const iconImg = document.createElement('IMG');
  iconImg.setAttribute('src', `${iconBaseUrl}${icon}${iconUrlBack}`);
  iconImg.setAttribute('width', '100');
  iconImg.setAttribute('height', '100');
  iconImg.setAttribute('alt', 'Weather Icon');
  document.body.appendChild(iconImg);
}

function appendWeatherData(div: HTMLDivElement, weatherData: any) {
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
