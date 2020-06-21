const button = document.querySelector('#butonek');
const input: HTMLInputElement = document.querySelector(
  '#location'
) as HTMLInputElement;
const weatherContainer = document.querySelector('#weather_container');
const locationContainer = document.querySelector('#location_list');
const forecastContainer = document.querySelector('#forecast_container');

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = '&appid=81e564bdda8adddbc2d805694d19cdac';
const unitsType = '&units=metric';
const lang = '&lang=pl';
const iconString = '';
const iconBaseUrl = 'http://openweathermap.org/img/wn/';
const iconUrlBack = '@2x.png';

input?.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    onSearch();
  }
});

button?.addEventListener('click', async () => {
  onSearch();
});

async function onSearch() {
  if (locationContainer != null) {
    locationContainer.innerHTML = '';
  }
  if (weatherContainer != null) {
    weatherContainer.innerHTML = '';
  }

  if (forecastContainer != null) {
    forecastContainer.innerHTML = '';
  }

  const location = input.value;
  input.value = '';

  if (location == null || location == '') {
    alert('Pole nie może być puste');
  } else {
    const locationData = await searchLocation(location);
    console.log('list', locationData);
    if (locationData.count == 0) {
      alert(`Brak wyników`);
    } else if (locationData.cod == '404') {
      alert(`Nie znaleziono prognozy dla ${location}`);
    } else if (locationData.cod == '400') {
      alert(`Niewłaściwe żądanie`);
    } else {
      locationData.list.forEach((element: any) => {
        console.log('element', element);

        const listItem = document.createElement('div');
        listItem.classList.add('list_item');
        locationContainer?.append(listItem);

        const listItemId = element.id;
        const listItemName = element.name;
        const icon = element.weather[0].icon;

        const locationText = document.createElement('span');
        locationText.classList.add('location_text');
        locationText.innerHTML = `${listItemName}`;
        listItem.append(locationText);

        const cordLink = document.createElement('a');
        cordLink.classList.add('cord_link');
        cordLink.textContent = `[${element.coord.lat},${element.coord.lon}]`;
        cordLink.href = `https://www.google.com/maps/search/${element.coord.lat},${element.coord.lon}`;
        cordLink.target = '_blank';
        listItem?.append(cordLink);

        const locationButton = document.createElement('button');
        locationButton.classList.add('button_id');
        locationButton.innerHTML = 'Pokaż prognozę';
        listItem?.append(locationButton);

        locationButton.addEventListener('click', async () => {
          if (weatherContainer != null) {
            weatherContainer.innerHTML = '';
          }

          if (locationContainer != null) {
            locationContainer.innerHTML = '';
          }

          if (forecastContainer != null) {
            forecastContainer.innerHTML = '';
          }

          console.log('pobieram pogode dla: ', listItemName);
          const weatherData = await getWeatherDataFromId(listItemId);

          const locationElement = document.createElement('div');
          locationElement.id = 'weather_elements';
          weatherContainer?.append(locationElement);
          appendWeatherData(locationElement, weatherData);

          const locationElementIcon = document.createElement('div');
          weatherContainer?.append(locationElementIcon);
          appendIcon(locationElementIcon, icon);
          console.log(icon);

          console.log('weather', weatherData);

          const weatherForecast = await getForecast(listItemId);
          console.log('forecast', weatherForecast);

          const forecastItems = document.createElement('div');
          forecastItems.id = 'forecast_text';
          forecastItems.innerHTML = 'Prognoza na najbliższe dni';
          forecastContainer?.append(forecastItems);

          appendForecastData(forecastItems, weatherForecast);
        });
      });
    }
  }
}

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
  const iconImg = document.createElement('img');

  iconImg.src = `${iconBaseUrl}${icon}${iconUrlBack}`;
  iconImg.width = 100;
  iconImg.height = 100;
  iconImg.alt = 'Weather Icon';

  div.appendChild(iconImg);
}

function appendWeatherData(div: HTMLDivElement, weatherData: any) {
  const name_span = document.createElement('span');
  name_span.id = 'name';
  name_span.innerHTML = weatherData.name;
  div?.append(name_span);

  const temp_span = document.createElement('span');
  temp_span.id = 'temp';
  temp_span.textContent = `Temperatura: ${(temp_span.innerHTML =
    weatherData.main.temp)}\xB0C`;

  div?.append(temp_span);

  const feels_like_span = document.createElement('span');
  feels_like_span.id = 'feels_like';
  feels_like_span.textContent = `Temperatura Odczuwalna: ${(feels_like_span.innerHTML =
    weatherData.main.feels_like)}\xB0C`;

  div?.append(feels_like_span);

  const temp_min_max_span = document.createElement('span');
  temp_min_max_span.id = 'temp_min_max';
  temp_min_max_span.textContent = `Temp min: ${(temp_min_max_span.innerHTML =
    weatherData.main.temp_min)}\xB0C | Temp max: ${(temp_min_max_span.innerHTML =
    weatherData.main.temp_max)}\xB0C`;
  div?.append(temp_min_max_span);

  const pressure_span = document.createElement('span');
  pressure_span.id = 'pressure';
  pressure_span.textContent = `Ciśnienie: ${(pressure_span.innerHTML =
    weatherData.main.pressure)} hPa`;
  div?.append(pressure_span);

  const description_span = document.createElement('span');
  description_span.id = 'description';
  description_span.innerHTML = weatherData.weather[0].description;
  div?.append(description_span);

  const wind_dir = getWindDirection(weatherData.wind.deg);

  const wind_span = document.createElement('span');
  wind_span.id = 'wind';
  wind_span.textContent = `Wiatr: ${(wind_span.innerHTML =
    weatherData.wind.speed)} m/s | Kierunek: ${wind_dir}`;

  div?.append(wind_span);

  const clouds_span = document.createElement('span');
  clouds_span.id = 'clouds';
  clouds_span.textContent = `Zachmurzenie: ${(clouds_span.innerHTML =
    weatherData.clouds.all)}%`;
  div?.append(clouds_span);
}

function getWindDirection(wind_direction: number) {
  var direction = '';
  if (wind_direction >= 337.5 || wind_direction <= 22.5) {
    direction = 'N';
    return direction;
  } else if (wind_direction <= 67.5) {
    direction = 'NE';
    return direction;
  } else if (wind_direction <= 112.5) {
    direction = 'E';
    return direction;
  } else if (wind_direction <= 157.5) {
    direction = 'SE';
    return direction;
  } else if (wind_direction <= 202.5) {
    direction = 'S';
    return direction;
  } else if (wind_direction <= 247.5) {
    direction = 'SW';
    return direction;
  } else if (wind_direction <= 292.5) {
    direction = 'W';
    return direction;
  } else {
    direction = 'NW';
    return direction;
  }
}

async function getForecast(listItemId: string) {
  const responseIdForecast = await fetch(
    `${baseUrl}/forecast?id=${listItemId}${unitsType}${appId}${lang}`
  );
  return responseIdForecast.json();
}

function appendForecastData(div: HTMLDivElement, forecastData: any) {
  const arraySize = forecastData.list.length - 1;
  console.log(arraySize);
  const forecastItemContainerElements = document.createElement('div');
  forecastItemContainerElements.classList.add('forecast_elements');
  forecastContainer?.append(forecastItemContainerElements);

  for (var i = 0; i < arraySize; i++) {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast_item');
    const forecastItemContainer = document.createElement('div');
    forecastItemContainer.classList.add('forecast_item_container');
    forecastItemContainerElements?.append(forecastItemContainer);
    forecastItemContainer.append(forecastItem);

    const allDays = [
      'Niedziela',
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
    ];
    const d = new Date(forecastData.list[i].dt * 1000);
    const dayName = allDays[d.getDay()];
    console.log(dayName);

    const dateTimeString =
      '(' +
      ('0' + d.getDate()).slice(-2) +
      '.' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ') ' +
      ('0' + d.getHours()).slice(-2) +
      ':' +
      ('0' + d.getMinutes()).slice(-2);

    const f_text_span = document.createElement('span');
    f_text_span.classList.add('f_text');
    f_text_span.innerHTML = `${dayName} ${dateTimeString}`;
    forecastItem?.append(f_text_span);

    const f_temp_span = document.createElement('span');
    f_temp_span.classList.add('f_temp');
    f_temp_span.textContent = `Temperatura: ${(f_temp_span.innerHTML =
      forecastData.list[i].main.temp)}\xB0C`;
    forecastItem?.append(f_temp_span);

    const f_temp_min_max_span = document.createElement('span');
    f_temp_min_max_span.classList.add('f_min_max_temp');
    f_temp_min_max_span.textContent = `Temp min: ${(f_temp_min_max_span.innerHTML =
      forecastData.list[i].main.temp_max)}
      \xB0C | Temp max: ${(f_temp_min_max_span.innerHTML =
        forecastData.list[i].main.temp_min)}\xB0C`;
    forecastItem?.append(f_temp_min_max_span);

    const f_pressure_span = document.createElement('span');
    f_pressure_span.classList.add('f_pressure');
    f_pressure_span.textContent = `Ciśnienie: ${(f_pressure_span.innerHTML =
      forecastData.list[i].main.pressure)} hPa`;
    forecastItem?.append(f_pressure_span);

    const f_description_span = document.createElement('span');
    f_description_span.classList.add('f_description');
    f_description_span.innerHTML = forecastData.list[i].weather[0].description;
    forecastItem?.append(f_description_span);

    const f_wind_dir = getWindDirection(forecastData.list[i].wind.deg);

    const f_wind_span = document.createElement('span');
    f_wind_span.classList.add('f_wind');
    f_wind_span.textContent = `Wiatr: ${(f_wind_span.innerHTML =
      forecastData.list[i].wind.speed)} m/s | Kierunek: ${f_wind_dir}`;
    forecastItem?.append(f_wind_span);

    const f_clouds_span = document.createElement('span');
    f_clouds_span.classList.add('f_clouds');
    f_clouds_span.textContent = `Zachmurzenie: ${(f_clouds_span.innerHTML =
      forecastData.list[i].clouds.all)}%`;
    forecastItem?.append(f_clouds_span);

    const forecastIconImgString = forecastData.list[i].weather[0].icon;
    const forecastIconImg = document.createElement('img');

    forecastIconImg.src = `${iconBaseUrl}${forecastIconImgString}${iconUrlBack}`;
    forecastIconImg.width = 100;
    forecastIconImg.height = 100;
    forecastIconImg.alt = 'Weather Icon';

    forecastItem.appendChild(forecastIconImg);
  }
}
