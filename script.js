const apiKey = '978faeea6ad416cf7df2631b5b2f2fde'; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherData.cod === '404' || forecastData.cod === '404') {
            alert('City not found');
            return;
        }

        displayWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data');
    }
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    setWeatherBackground(data.weather[0].description); // Change to description
    weatherDiv.innerHTML = `
        <div class="weather-icon">${weatherIcon}</div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <h3>${data.weather[0].description}</h3>
        <div class="weather-details">
            <div class="weather-detail"><i class="fas fa-thermometer-half"></i> Temperature: ${data.main.temp}°C</div>
            <div class="weather-detail"><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</div>
            <div class="weather-detail"><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</div>
            <div class="weather-detail"><i class="fas fa-eye"></i> Visibility: ${data.visibility / 1000} km</div>
            <div class="weather-detail"><i class="fas fa-tachometer-alt"></i> Pressure: ${data.main.pressure} hPa</div>
            <div class="weather-detail"><i class="fas fa-water"></i> Dew Point: ${(data.main.temp - ((100 - data.main.humidity) / 5)).toFixed(1)}°C</div>
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('forecast');

    // Show forecast for the next 5 days at noon
    for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes('12:00:00')) {
            const day = data.list[i];
            const forecastIcon = getWeatherIcon(day.weather[0].main);
            const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            forecastDiv.innerHTML += `
                <div class="forecast-day">
                    <div>${date}</div>
                    <div class="weather-icon">${forecastIcon}</div>
                    <div>${day.main.temp}°C</div>
                </div>
            `;
        }
    }

    document.getElementById('weather').appendChild(forecastDiv);
}

function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clear':
            return '<i class="fas fa-sun"></i>';
        case 'Clouds':
            return '<i class="fas fa-cloud"></i>';
        case 'Rain':
            return '<i class="fas fa-cloud-showers-heavy"></i>';
        case 'Snow':
            return '<i class="fas fa-snowflake"></i>';
        case 'Thunderstorm':
            return '<i class="fas fa-bolt"></i>';
        case 'Mist':
        case 'Fog':
        case 'Haze':
            return '<i class="fas fa-smog"></i>';
        case 'Broken Clouds':
            return '<i class="fas fa-cloud-sun"></i>';
        default:
            return '<i class="fas fa-cloud-sun"></i>';
    }
}

function setWeatherBackground(description) {
    let imageUrl;
    switch (description) {
        case 'clear sky':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_263027252-1.webp';
            break;
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
            imageUrl = 'https://i.pinimg.com/originals/39/9c/d5/399cd5ec7b5329d6cda568d99419474b.jpg';
            break;
        case 'overcast clouds':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_1771049072.webp';
            break;
        case 'shower rain':
        case 'rain':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_68810479.webp';
            break;
        case 'snow':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_65255689.webp';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_121582312.webp';
            break;
        case 'thunderstorm':
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_151812536.webp';
            break;
        default:
            imageUrl = 'https://outforia.com/wp-content/uploads/2022/01/shutterstock_1771049072.webp';
    }

    document.body.style.backgroundImage = `url('${imageUrl}')`;
}
