
if(localStorage.getItem("users")==null){
    var user = [];
    localStorage.setItem("users", JSON.stringify(user));
}

if(localStorage.getItem("harjoitukset")==null){
    var harjoitus = [];
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitus));
}


//Element variables, harjoitusTiedot-form and submitHarjoitus-button
const harjoitusTiedot = document.getElementById('harjoitusTiedot');
const submitHarjoitus = document.getElementById('submitHarjoitus');
const deleteHarjoitus = document.getElementById('deleteHarjoitus');


//Element variables, personalInfo-form and submitUser-button
const personalInfo = document.getElementById('personalInfo');
const submitUser = document.getElementById('submitUser');




function processUser(e) {
    e.preventDefault();

    var user = JSON.parse(localStorage.getItem("users")) || [];

    
    //Variables in user-form
    var name = document.getElementById("name").value;
    var email = document.getElementById("sposti").value;

    //Checking if values are properly filled
    if(name == null || name == ""){
        document.getElementById("name").style.borderColor = "red";
        document.getElementById("feedback").style.color = "red";
        document.getElementById("feedback").innerHTML = "Nimi on pakollinen";
        return false;
    } 
    if(email==null || email=="" || email.length < 6 || email.length > 30 || email.indexOf("@") === -1){
        document.getElementById("sposti").style.borderColor = "red";
        document.getElementById("feedback2").style.color = "red";
        document.getElementById("feedback2").innerHTML = "Sähköpostissa pitää olla 7-30 merkkiä ja @-merkki";
        return false;
    } 


    // Create a new user
    var userInfo = {
        name: name,
        email: email,
    }

    // Save user to localstorage
    user.push(userInfo);
    localStorage.setItem("users", JSON.stringify(user));


   //Make the hidden element visible and greet user
    var hello = document.getElementById('hello');
    var harjoitukset = document.getElementById('harjoitukset');

    harjoitukset.style.display = 'block';
    hello.style.display = 'block';
    hello.innerHTML = '<figure><img src="smilingcat.jpg" alt="welcome, hello"></figure><br><h2>Tervetuloa, ' + name + '!</h2>';

    //If there was corrections on form, change the red borders and text back to normal
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("feedback2").innerHTML = "";
    document.getElementById("name").style.borderColor = "";
    document.getElementById("sposti").style.borderColor = "";
    document.getElementById("feedback").style.color = "";
    document.getElementById("feedback2").style.color = "";


    return true;
}

//Add dynamic event to button
submitUser.addEventListener('click', processUser);





//Saving data from harjoitusTiedot-form
function saveData(e) {
    e.preventDefault();
    
    //Variables 
    var pvm = document.getElementById('pvm').value;
    var harjoitus = document.getElementById('harjoitus').value;
    var kesto = document.getElementById('kesto').value;
    var fiilis = document.getElementById('fiilis').value;

    

    loadData();

}

//Getting harjoitusTiedot to the table on website
function loadData() {
    var allHarjoitukset = localStorage.getItem("harjoitukset");
    var jsonHarjoitukset = JSON.parse(allHarjoitukset);

    //Where to save data
    var place = document.getElementById("harjoitusTaulu");

    if (jsonHarjoitukset && jsonHarjoitukset.length > 0) {
        // Näytä taulukon otsikot
        var table = "<table border='1'><tr><th>Nro</th><th>Päivämäärä</th><th>Harjoitus</th><th>Kesto</th><th>Fiilis</th></tr>";

        //Adding new row and values to table
        for (var i = 0; i < jsonHarjoitukset.length; i++) {
            table += "<tr><td>" + (i + 1) + "</td><td>" 
            + jsonHarjoitukset[i].pvm + "</td><td>" 
            + jsonHarjoitukset[i].harjoitus + "</td><td>"
            + jsonHarjoitukset[i].kesto + "</td><td>"
            + jsonHarjoitukset[i].fiilis + "</td><td>";
        }

        table += "</table>";
        place.innerHTML = table;
    } else {
        // Piilota taulukko
        place.innerHTML = "";
    }
}


//Create dynamic event to submitHarjoitus-button
submitHarjoitus.addEventListener('click', saveData);







function deleteData() {

}


//Create dynamic evetnt to deleteHarjoitus
deleteHarjoitus.addEventListener('click', deleteData);





//Changing the theme for the page
//Possible theme choices
const uinti = document.getElementById('uinti');
const rauha = document.getElementById('rauha');
const iloinen = document.getElementById('iloinen');
const voima = document.getElementById('voima');

//Defaul theme
uinti.checked = true;

//Create dynamic events to theme choices
uinti.addEventListener('change', changeStyle);
rauha.addEventListener('change', changeStyle);
iloinen.addEventListener('change', changeStyle);
voima.addEventListener('change', changeStyle);



//Theme pictures
var kuvaJoukko = {
    "uinti": "swimmingpool.png",
    "rauha": "mindfulness.png",
    "iloinen": "happyRun.png",
    "voima": "voima.png"
    };

function kuvanVaihto(kuvaJoukko) {
    var kuva = document.getElementById("teemaKuva");
    kuva.src = kuvaJoukko;
}

//Function to change colors and pictures according the selection
function changeStyle() {
    var aside = document.querySelector('aside');
    var footer = document.querySelector('footer');
    var h1 = document.querySelector('h1');
    var navigator = document.querySelector('nav');
    

    if (uinti.checked) {
        document.body.style.backgroundColor =  'rgba(0, 255, 255, 0.226)';
        kuvanVaihto(kuvaJoukko["uinti"]);
        aside.style.background = 'linear-gradient(rgb(48, 104, 129), rgb(82, 142, 159), rgb(48, 104, 129))';
        footer.style.background = 'linear-gradient(rgb(48, 104, 129), rgb(82, 142, 159), rgb(48, 104, 129))';
        h1.style.background = 'rgb(7, 199, 177)';
        navigator.style.backgroundImage = 'url("air.png")';
    } else if (rauha.checked) {
        document.body.style.backgroundColor = 'rgba(232, 42, 189, 0.23)';    
        kuvanVaihto(kuvaJoukko["rauha"]);
        aside.style.background = 'linear-gradient(purple, rgb(232, 42, 189), purple)';
        footer.style.background = 'linear-gradient(purple, rgb(232, 42, 189), purple)';
        h1.style.background = 'purple';
        navigator.style.backgroundImage = 'url("air_purple.jpg")';
    } else if (iloinen.checked) {
        document.body.style.backgroundColor = 'rgba(246, 228, 58, 0.6)';
        kuvanVaihto(kuvaJoukko["iloinen"]);
        aside.style.background = 'linear-gradient(darkgoldenrod, rgb(246, 228, 58), darkgoldenrod)';
        footer.style.background = 'linear-gradient(darkgoldenrod, rgb(246, 228, 58), darkgoldenrod)';
        h1.style.background = 'darkgoldenrod';
        navigator.style.backgroundImage = 'url("air_yellow.jpg")';
    } else if (voima.checked){
        document.body.style.backgroundColor = 'rgba(232, 42, 42, 0.65)';
        kuvanVaihto(kuvaJoukko["voima"]);
        aside.style.background = 'linear-gradient(darkred, rgba(232, 42, 42, 0.65), darkred)';
        footer.style.background = 'linear-gradient(darkred, rgba(232, 42, 42, 0.65), darkred)';
        h1.style.background = 'darkred';
        navigator.style.backgroundImage = 'url("air_red.jpg")';
    }

}

