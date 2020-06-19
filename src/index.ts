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
      locationButton.id = 'buttonId';
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
          locationElement.id = 'weather_elements';
          weatherContainer?.append(locationElement);
          appendWeatherData(locationElement, weatherData);

          const locationElementIcon = document.createElement('div');
          weatherContainer?.append(locationElementIcon);
          appendIcon(locationElementIcon, icon);
          console.log(icon);
        }
        console.log('weather', weatherData);

        const weatherForecast = await getForecast(listItemId);
        console.log('forecast', weatherForecast);

        const forecastItems = document.createElement('div');
        forecastContainer?.append(forecastItems);
        appendForecastData(forecastItems, weatherForecast);
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

  const wind_dir = getWindDirection(weatherData);

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

function getWindDirection(weatherData: any) {
  const wind_direction = weatherData.wind.deg;
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
  } else if (wind_direction <= 337.5) {
    direction = 'NW';
    return direction;
  }
  return;
}

function getWindDirectionForeCast(forcastData: any, index: any) {
  const f_wind_direction = forcastData.list[index].wind.deg;
  var direction = '';
  if (f_wind_direction >= 337.5 || f_wind_direction <= 22.5) {
    direction = 'N';
    return direction;
  } else if (f_wind_direction <= 67.5) {
    direction = 'NE';
    return direction;
  } else if (f_wind_direction <= 112.5) {
    direction = 'E';
    return direction;
  } else if (f_wind_direction <= 157.5) {
    direction = 'SE';
    return direction;
  } else if (f_wind_direction <= 202.5) {
    direction = 'S';
    return direction;
  } else if (f_wind_direction <= 247.5) {
    direction = 'SW';
    return direction;
  } else if (f_wind_direction <= 292.5) {
    direction = 'W';
    return direction;
  } else if (f_wind_direction <= 337.5) {
    direction = 'NW';
    return direction;
  }
  return;
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

  for (var i = 0; i < arraySize; i++) {
    const forecastItem = document.createElement('div');
    forecastItem.id = 'forecast_item';
    forecastContainer?.append(forecastItem);

    const f_text_span = document.createElement('span');
    f_text_span.id = 'f_text';
    f_text_span.innerHTML = forecastData.list[i].dt_txt;
    forecastItem?.append(f_text_span);

    const f_temp_span = document.createElement('span');
    f_temp_span.id = 'f_temp';
    f_temp_span.textContent = `Temperatura: ${(f_temp_span.innerHTML =
      forecastData.list[i].main.temp)}\xB0C`;
    forecastItem?.append(f_temp_span);

    const f_temp_min_max_span = document.createElement('span');
    f_temp_min_max_span.id = 'f_min_max_temp';
    f_temp_min_max_span.textContent = `Temp min: ${(f_temp_min_max_span.innerHTML =
      forecastData.list[i].main.temp_max)}
      \xB0C | Temp max: ${(f_temp_min_max_span.innerHTML =
        forecastData.list[i].main.temp_min)}\xB0C`;
    forecastItem?.append(f_temp_min_max_span);

    const f_pressure_span = document.createElement('span');
    f_pressure_span.id = 'f_pressure';
    f_pressure_span.textContent = `Ciśnienie: ${(f_pressure_span.innerHTML =
      forecastData.list[i].main.pressure)} hPa`;
    forecastItem?.append(f_pressure_span);

    const f_description_span = document.createElement('span');
    f_description_span.id = 'f_description';
    f_description_span.innerHTML = forecastData.list[i].weather[0].description;
    forecastItem?.append(f_description_span);

    const f_wind_dir = getWindDirectionForeCast(forecastData, i);

    const f_wind_span = document.createElement('span');
    f_wind_span.id = 'f_wind';
    f_wind_span.textContent = `Wiatr: ${(f_wind_span.innerHTML =
      forecastData.list[i].wind.speed)} m/s | Kierunek: ${f_wind_dir}`;
    forecastItem?.append(f_wind_span);

    const f_clouds_span = document.createElement('span');
    f_clouds_span.id = 'f_clouds';
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
