//Variables for buttons
const hae_paikka_btn = document.getElementById('asema');

//Dynamic events fot buttons
hae_paikka_btn.addEventListener('click', haePaikkaJSON);

//alustetaan muuttuja, johon tallenetaan asemannimet, niin että sitä voidaan hyödyntää myös toisessa funktiossa
let asemaNimet = null;


//HAKU-FUNKTIO
//Haetaan käyttäjän antamalla aseman nimellä löytyykö sen nimistä VR:n asemaa ja jos ei löydy, niin ilmoittaa
function haePaikkaJSON(e) {
    e.preventDefault(); 
    var asema = document.getElementById('aseman_haku').value; //muuttujaan tallennetaan käyttäjän syöttämä tieto

    var haku = new XMLHttpRequest(); 

    haku.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var jsonDocument = haku.responseText;
            var jsData = JSON.parse(jsonDocument);
            asemaNimet = jsData; //tallennetaan haetut asematiedot muuttujaan, jota tarvitaan myöhemmin tämän funktion ulkopuolella

            //alustetaan muuttuja, että onko asema löytynyt
            var found = false; 

            //käydään läpi haetut aesmatiedot asema kerrallaan ja tarkistetaan löytyykö haettu asema
            for (var i = 0; i < jsData.length; i++){
                var asemaTiedot = jsData[i];

                var stationName = asemaTiedot.stationName.toLowerCase(); //muutetaan asemanimet pieniksi kirjaimeksi ja seuraavalla rivillä myös hakuasema, jotta vertailu onnistuu
                if (stationName.includes(asema.toLowerCase())) {  
                    found = true;
                    var lyhenne = asemaTiedot.stationShortCode; //kun asema löytynyt, niin haetaan aseman lyhennetieto, jota tarvitaan seuraavassa funktiossa
    
                    haeAsemanJunat(lyhenne); //kutsutaan fuktio junien hakemiseksi
                    findLocation(asema); //kutsutaan fuktio paikallisen säätiedon hakemiseksi
    
                    //kun asema löytynyt, niin laitetaan näkyviksi juna- ja säätieto osiot
                    var junaTiedot = document.getElementById('junaTiedot');
                    junaTiedot.style.display = 'flex';
                    saaTieto.style.display = 'flex';
                    var otsikko = document.getElementById('otsikko');
                    //nimetään otsikko, johon tulostuu haetun aseman nimi isoilla kirjaimilla
                    otsikko.innerHTML = '<h3> ' + asema.toUpperCase() + ': Lähtevät junat</h3>';
                        
                    break;
                }

            }
            
            //jos asemaa ei löytynyt, niin ikkunaan tulee ilmoitus siitä
            if (!found) {
                alert("Hakemaasi asemaa ei löytynyt");

            }

        }
    };
    haku.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations", true);
    haku.send();
}


//haetaan asemalta lähtevät junat ja niiden tiedot

function haeAsemanJunat(lyhenne) {
    var junaHaku = new XMLHttpRequest();
    //määritelty api-kutsuun, että haetaan seuraavan 60min aikana asemalta lähtevät junat, aikaa olisi voinut määritellä miten vaan ja olisi voinut hakea myös saapuvat junat
    var junaURL = "https://rata.digitraffic.fi/api/v1//live-trains/station/" + lyhenne + "?minutes_before_departure=60&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0";
    junaHaku.open("GET", junaURL, true);
    junaHaku.send();

    junaHaku.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var junaJson = junaHaku.responseText;
            var junaData = JSON.parse(junaJson);
            console.log(junaData);

            //luodaan lista asemalla pysähtyvistä junista ja niiden tiedoista, niin että myöhemmin voidaan lajitella lähtöajan mukaan ennen taulukon tulostamista
            var junat = [];
            
            //käydään läpi jokaisen juna yksitellen ja haetaan halutut tiedot
            for (var i = 0; i < junaData.length; i++){
                var junaTiedot = junaData[i];
                var trainType = junaTiedot.trainType;
                var trainNumber = junaTiedot.trainNumber;
                //junakategoriat tallennetaan suomenkielisiksi
                var trainCategory = junaTiedot.trainCategory;
                if (trainCategory === "Commuter") {
                    trainCategory = "Lähijuna";
                } else if (trainCategory === "Long-distance"){
                    trainCategory = "Kaukojuna";
                } else if (trainCategory === "Shunting"){
                    trainCategory = "Siirrossa";
                }

                //alustetaan muuttujia
                var scheduledTime = null;
                var asemaKokoNimi = null;


                //käydään läpi junan aiktaulutietoja, jotta löydetään tieto kellonajasta, milloin lähtee halutulta asemalta
                for (var j = 0; j < junaTiedot.timeTableRows.length; j++) {
                    var asema = junaTiedot.timeTableRows[j];
                    //Apista tuleva aika on UTC-aikavyöhykkeen mukainen ja halusin tulostuksen suomen aikaa ja vain tunnit ja minuutit
                    if (asema.stationShortCode === lyhenne){
                        var scheduledTimeUTC = asema.scheduledTime;
                        var scheduledTimeLocal = new Date(scheduledTimeUTC);
                        //muodostetaan haluttu tulostusmuoto ajalle, esim. jos tunti tai minuutti on ilmaistu yhtenä numerona, niin lisätään 0
                        scheduledTime = ("0" + scheduledTimeLocal.getHours()).slice(-2) + ":" + ("0" + scheduledTimeLocal.getMinutes()).slice(-2); 
                    }

                    //käydään läpi aikataulutiedot pääteaseman hakemiseksi, viimeisin asema on pääteasema
                    for (var k = 0; k < asemaNimet.length; k++) {
                        //koska junien aikataulutiedoissa vaan lyhenteet, niin haetaan aikaisemmin tallennetusta asematiedosta lyhenteen avulla aseman koko nimi
                        if (asema.stationShortCode === asemaNimet[k].stationShortCode) {
                            asemaKokoNimi = asemaNimet[k].stationName;
                            //koska joissakin asemissa (lähinnä Helsinki asema) oli perässä asema, niin poistetaan se
                            if (asemaKokoNimi.endsWith("asema")) {
                                asemaKokoNimi = asemaKokoNimi.slice(0, -5);
                            }
                            break;
                        }
                    }

                }
                
                //tallennetaan junan tiedot aiemmin alustettuun junat-listaan
                junat.push({
                    scheduledTime: scheduledTime,
                    trainType: trainType,
                    trainNumber: trainNumber,
                    trainCategory: trainCategory,
                    asemaKokoNimi: asemaKokoNimi
                });
                //järjestetään junat lähtöajan mukaan 
                junat.sort((a, b) => {
                    var today = new Date().toISOString().slice(0, 10);
                    var timeA = new Date(today + "T" + a.scheduledTime);
                    var timeB = new Date(today + "T" + b.scheduledTime);
                    return timeA - timeB;
                });

                //luodaan taulu, jonne tulostetaan jokaisen junan tiedot
                var taulukko = "<table border='1'><tr><th>Lähtöaika</th><th>Juna</th><th>Junan päämäärä</th></tr>";
                junat.forEach(juna => {
                    taulukko += "<tr><td>"  + juna.scheduledTime + "</td><td>" +
                    juna.trainCategory + "<br>" + juna.trainType + " " + juna.trainNumber + "</td><td>" + juna.asemaKokoNimi + "</td></tr>";
                });
            }
            taulukko += "</table>";
            document.getElementById("junaTaulu").innerHTML = taulukko;   
        }
    }
}




//Säätietojen hakeminen, workshopista hyödynnetty ja halusin myös tässä tulostaa tuo ikonin, jota en itsenäisessä harjoituksessa tajunnut


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
            console.log(weatherInfo);

            var tulostus = "<table id=weather>";
            var temperature = weatherInfo.main.temp;
            var celsius = (temperature - 273.15).toFixed(1);
            var icon = weatherInfo.weather[0].icon;
            var newSrc = "https://openweathermap.org/img/w/" + icon + ".png";
            tulostus += "<tr><td>" + celsius + "°C" + "</td><td>" + "<img src='" + newSrc + "'></img></td></tr>";


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

                haeSaa(sijainti);     
            } else {
                alert("Asemalle ei löytynyt säätietoja");
            }
        }
    };
}