//Variables for buttons
const hae_paikka_btn = document.getElementById('asema');

//Dynamic events fot buttons
hae_paikka_btn.addEventListener('click', haePaikkaJSON);

function haePaikkaJSON(e) {
    e.preventDefault();
    var asema = document.getElementById('aseman_haku').value;

    var haku = new XMLHttpRequest();

    haku.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var jsonDocument = haku.responseText;
            var jsData = JSON.parse(jsonDocument);

            var found = false;

            for (var i = 0; i < jsData.length; i++){
                var asemaTiedot = jsData[i];

                var stationName = asemaTiedot.stationName.toLowerCase();
                if (stationName.includes(asema.toLowerCase())) {  
                    found = true;
                    var lyhenne = asemaTiedot.stationShortCode;
    
                    haeAsemanJunat(lyhenne);
                    findLocation(asema);
    
                    var junaTiedot = document.getElementById('junaTiedot');
                    junaTiedot.style.display = 'block';
                    var otsikko = document.getElementById('otsikko');
                    otsikko.innerHTML = '<h3> ' + asema + ': lähtevät junat</h3>';
                        
                    break;
                }

            }
            
            if (!found) {
                alert("Hakemaasi asemaa ei löytynyt");

            }

        }
    };
    haku.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations", true);
    haku.send();
}


function haeAsemanJunat(lyhenne) {
    console.log(lyhenne);
    var junaHaku = new XMLHttpRequest();
    var junaURL = "https://rata.digitraffic.fi/api/v1//live-trains/station/" + lyhenne + "?minutes_before_departure=30&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0";
    junaHaku.open("GET", junaURL, true);
    junaHaku.send();

    junaHaku.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var junaJson = junaHaku.responseText;
            var junaData = JSON.parse(junaJson);
            console.log(junaData);

            var taulukko = "<table border='1'><tr><th>Lähtöaika</th><th>Juna</th><th>Junan päämäärä</th></tr>";
    

            
            for (var i = 0; i < junaData.length; i++){
                var junaTiedot = junaData[i];
                var trainType = junaTiedot.trainType;
                console.log(trainType);
                var trainNumber = junaTiedot.trainNumber;
                var trainCategory = junaTiedot.trainCategory;
                if (trainCategory === "Commuter") {
                    trainCategory = "Lähijuna";
                } else if (trainCategory === "Long-distance"){
                    trainCategory = "Kaukojuna";
                } else if (trainCategory === "Shunting"){
                    trainCategory = "Siirrossa";
                }
                var scheduledTime = null;
                var viimeinenAsema = null;

                for (var j = 0; j < junaTiedot.timeTableRows.length; j++) {
                    var asema = junaTiedot.timeTableRows[j];
                    if (asema.stationShortCode === "HKI"){
                        //Apista tuleva aika on UTC-aikavyöhykkeen mukainen ja halusin tulostuksen suomen aikaa ja vain tunnit ja minuutit
                        var scheduledTimeUTC = asema.scheduledTime;
                        var scheduledTimeLocal = new Date(scheduledTimeUTC);
                        scheduledTime = ("0" + scheduledTimeLocal.getHours()).slice(-2) + ":" + ("0" + scheduledTimeLocal.getMinutes()).slice(-2);

                    }
                    viimeinenAsema = asema.stationShortCode;
                }
                    
                taulukko += "<tr><td>"  + scheduledTime + "</td><td>" +
                trainCategory + "<br>" + trainType + " " + trainNumber + "</td><td>" + viimeinenAsema + "</td></tr>";
            }
            taulukko += "</table>";
            document.getElementById("junaTaulu").innerHTML = taulukko;   
        }
    }
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