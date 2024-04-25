//Variables for buttons
const hae_paikka_btn = document.getElementById('asema');

//Dynamic events fot buttons
hae_paikka_btn.addEventListener('click', haePaikkaJSON);

function haePaikkaJSON(e) {
    e.preventDefault();
    var asema = document.getElementById('aseman_haku').value;
    var kellonaika = document.getElementById('kellonaika').value;
    var kello = kellonaika + ":00";

    //luodaan hakua varten aika, jottei api-osoitteeseen tarvitse kovakoodata, sillä osoitteen voimassaolo muuttuu päivän mukaan
    var currentDate = new Date();
    var vuosi = currentDate.getFullYear();
    var kuukausi = String(currentDate.getMonth() + 1).padStart(2, '0');
    var paiva = String(currentDate.getDate()).padStart(2, '0');
    var aika = vuosi + "-" + kuukausi + "-" + paiva + "T" + kello + "Z/" + vuosi + "-" + kuukausi + "-" + paiva + "T" + kello + "Z"
    var haku = new XMLHttpRequest();

    haku.open("GET", "https://rata.digitraffic.fi/infra-api/0.7/13391/rautatieliikennepaikat.json?time=" + aika + "&typeNames=liikennepaikka", true);
    haku.send();

    haku.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var jsonDocument = haku.responseText;
            var jsData = JSON.parse(jsonDocument);

            var found = false;

            for (var tunniste in jsData) {
                var asemaTiedot = jsData[tunniste];
                for (var i = 0; i < asemaTiedot.length; i++){
                    if (asemaTiedot[i].nimi.toLowerCase() === asema.toLowerCase()) {  //muutetaan niin hakusana kuin JSONsta löytävä aseman nimi pieniksi kirjaimiksi ja poistetaan JSONssa olevasta nimestä " " -jotka vaikuttivat haun onnistumiseen
                        found = true;
                        var lyhenne = asemaTiedot[i].lyhenne;

                        haeAsemanJunat(lyhenne);
                        findLocation(asema);
                        break;
                    }
                }
            }
            if (!found) {
                alert("Hakemaasi asemaa ei löytynyt");

            }

        }
    }
}


function haeAsemanJunat(paikka) {

    url = "/live-trains/station/" + paikka + "minutes_before_departure=120&minutes_after_departure=15&minutes_before_arrival=15&minutes_after_arrival=15";
}




//Säätietojen hakeminen, workshopista hyödynnetty


function haeSaa(sijainti) {
    var apiKey = "c573ba4b5309b920542bda0bed7d2d21"

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + sijainti.lat + "&lon=" + sijainti.lon +"&appid=" + apiKey;

    var getweather = new XMLHttpRequest();
    getweather.open("GET", weatherURL, true);

    getweather.send()

    getweather.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var weatherJson = getweather.responseText;
            var weatherInfo = JSON.parse(weatherJson);

            var saaTiedot = {
                main: weatherInfo.weather[0].main,
                temperature: weatherInfo.main.temp,
                clouds: weatherInfo.clouds.all,
                humidity: weatherInfo.main.humidity,
                place: weatherInfo.name
            };

            var celsius = (saaTiedot.temperature - 273.15).toFixed(1);

            var tulostus = "Location: " + saaTiedot.place + "<br>Weather: " + saaTiedot.main + "<br>Temperature: " + celsius + "°C<br>Cloudy: " + saaTiedot.clouds + "%<br>Humidity: " + saaTiedot.humidity + "%<br>";

            document.getElementById("weatherData").innerHTML = tulostus;

        }
    };
}



function findLocation(asema) {
    var asemaSijainti = asema
    var apiKey = "c573ba4b5309b920542bda0bed7d2d21";

    var locationURL = "https://api.openweathermap.org/geo/1.0/direct?q={" + asemaSijainti + "}&appid=" + apiKey;
    
    var getLocation = new XMLHttpRequest();
    getLocation.open("GET", locationURL, true);
    getLocation.send();

    getLocation.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var locationJson = getLocation.responseText;
            var locationData = JSON.parse(locationJson);
            console.log(locationData);
            if (locationData.length > 0){
           
                var sijainti = {
                    lat: locationData[0].lat,
                    lon: locationData[0].lon
                };

                console.log(sijainti);
                haeSaa(sijainti);     
            } else {
                alert("Asemalle ei löytynyt säätietoja");
            }
        }
    };
}