
if(localStorage.getItem("users")==null){
    var user = [];
    localStorage.setItem("users", JSON.stringify(user));
}

if(localStorage.getItem("harjoitukset")==null){
    var harjoitusData = [];
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitusData));
}


//Element variables, harjoitusTiedot-form and submitHarjoitus-button
const harjoitusTiedot = document.getElementById('harjoitusTiedot');
const submitHarjoitus = document.getElementById('submitHarjoitus');
const updateHarjoitus = document.getElementById('updateHarjoitus');
const deleteHarjoitus = document.getElementById('deleteHarjoitus');


//Element variables, personalInfo-form and submitUser-button
const personalInfo = document.getElementById('personalInfo');
const submitUser = document.getElementById('submitUser');




//////////////////////////USER INFORMATION/////////////////////


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


   //Make the hidden elements (greeting and exercise-form) visible 
    var hello = document.getElementById('hello');
    var harjoitukset = document.getElementById('harjoitukset');


    harjoitukset.style.display = 'block';
    hello.style.display = 'block';
    hello.innerHTML = '<h2>Tervetuloa, ' + name + '!</h2><figure><img src="smilingcat.jpg" alt="welcome, hello"></figure>';



    //If there was corrections on form, change the red borders and text back to normal
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("feedback2").innerHTML = "";
    document.getElementById("name").style.borderColor = "";
    document.getElementById("sposti").style.borderColor = "";
    document.getElementById("feedback").style.color = "";
    document.getElementById("feedback2").style.color = "";

    //Hide user-element
    var kayttaja = document.getElementById('user');
    kayttaja.style.display = 'none';
    
    loadData();

    return true;
}

//Add dynamic event to button
submitUser.addEventListener('click', processUser);




////////////////////////////////EXERCISES INFORMATION////////////////


//Saving data from harjoitusTiedot-form
function saveData(e) {
    e.preventDefault();
    var harjoitusData = JSON.parse(localStorage.getItem("harjoitukset")) || [];
    
    //Variables 
    var pvm = document.getElementById('pvm').value;
    var category = document.getElementById('valikko').value;
    var exercise = document.getElementById('harjoitus').value;
    var kesto = parseFloat(document.getElementById('kesto').value);
    var fiilis = document.getElementById('fiilis').value;

    
    //Checking if values are properly filled
    if(pvm == null || pvm == ""){
        document.getElementById("pvm").style.borderColor = "red";
        document.getElementById("palaute").style.color = "red";
        document.getElementById("palaute").innerHTML = "Päivämäärä on pakollinen";
        return false;
    } 
    if(category == null || category == ""){
        document.getElementById("valikko").style.borderColor = "red";
        document.getElementById("palaute2").style.color = "red";
        document.getElementById("palaute2").innerHTML = "Kategoria pitää valita";
        return false;
    } 
    if(exercise == null || exercise == "" || exercise.length > 100){
        document.getElementById("harjoitus").style.borderColor = "red";
        document.getElementById("palaute3").style.color = "red";
        document.getElementById("palaute3").innerHTML = "Harjoitus-kenttä ei voi olla tyhjä ja se ei saa olla yli 100 merkkiä.";
        return false;
    } 
    if(isNaN(kesto) || kesto < 0.1){
        document.getElementById("kesto").style.borderColor = "red";
        document.getElementById("palaute4").style.color = "red";
        document.getElementById("palaute4").innerHTML = "Kesto ei voi olla tyhjä tai negatiivinen";
        return false;
    } 

    // Create a new exercise-log
    var harjoitusInfo = {
        pvm: pvm,
        category: category,
        exercise: exercise,
        kesto: kesto,
        fiilis: fiilis,
    }

    // Save harjoitus to localstorage
    harjoitusData.push(harjoitusInfo);
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitusData));

    //If there were mistakes and they were corrected, resetting warnings
    document.getElementById("pvm").style.borderColor = "";
    document.getElementById("palaute").innerHTML = "";
    document.getElementById("valikko").style.borderColor = "";
    document.getElementById("palaute2").innerHTML = "";
    document.getElementById("harjoitus").style.borderColor = "";
    document.getElementById("palaute3").innerHTML = "";
    document.getElementById("kesto").style.borderColor = "";
    document.getElementById("palaute4").innerHTML = "";

    loadData();

}


//Getting harjoitusTiedot to the table on website
var table; //Global to be used in several functions

function loadData() {
    //get data from local storage
    var allHarjoitukset = localStorage.getItem("harjoitukset");
    var jsonHarjoitukset = JSON.parse(allHarjoitukset);

    //Where to save data
    var place = document.getElementById("harjoitusTaulu");

    if (jsonHarjoitukset && jsonHarjoitukset.length > 0) {
        // The headings for table
        var tableHTML = "<table border='1'><tr><th>Päivämäärä</th><th>Kategoria</th><th>Harjoitus</th><th>Kesto (h)</th><th>Fiilis</th></tr>";

        //Adding new row and values to table
        for (var i = 0; i < jsonHarjoitukset.length; i++) {
            tableHTML += 
            "<tr><td>" + jsonHarjoitukset[i].pvm + 
            "</td><td>" + jsonHarjoitukset[i].category + 
            "</td><td>" + jsonHarjoitukset[i].exercise + 
            "</td><td>" + jsonHarjoitukset[i].kesto + 
            "</td><td>" + jsonHarjoitukset[i].fiilis + "</td>";
        }

        tableHTML += "</table>";
        place.innerHTML = tableHTML;

        //Make summary-element visible
        var yhteenveto = document.getElementById('yhteenveto');
        yhteenveto.style.display = 'block';

        //Count the exercise summary
        informationSummary()

        //Select rows in table for updating and deleting
        selectRow();


    } else {
        // Hide if no data in local storage
        place.innerHTML = "";
    }
}


//Create dynamic event to submitHarjoitus-button
submitHarjoitus.addEventListener('click', saveData);




/////////////////////////////UPDATE&DELETE DATA FROM TABLE/////////

//Select row to be updated or deleted
var rIndex; //global to be used in several function

function selectRow() {

    //variables
    var place = document.getElementById("harjoitusTaulu"); 
    var tableRows = place.getElementsByTagName('tr');

    for(var i = 1; i < tableRows.length; i++)
    {
        tableRows[i].onclick = function(){
            // get the selected row 
            rIndex = this.rowIndex;

            //set the values from row to form
            document.getElementById('pvm').value = this.cells[0].innerHTML;
            document.getElementById('valikko').value = this.cells[1].innerHTML;
            document.getElementById('harjoitus').value = this.cells[2].innerHTML;
            document.getElementById('kesto').value = this.cells[3].innerHTML;
            document.getElementById('fiilis').value = this.cells[4].innerHTML;
        };
    }
}


//Update exercise information
function updateData(e){
    e.preventDefault(); //preventing default-actions

    //Variables
    var pvm = document.getElementById('pvm').value;
    var category = document.getElementById('valikko').value;
    var exercise = document.getElementById('harjoitus').value;
    var kesto = parseFloat(document.getElementById('kesto').value);
    var fiilis = document.getElementById('fiilis').value;
   
    var place = document.getElementById("harjoitusTaulu");
    var tableRows = place.getElementsByTagName('tr');
    
    //Goes through the rows to find and update selected row
    for (var i = 1; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName('td');
   
        //when selected row is found, the values are updated
        if (i === rIndex) {
            cells[0].innerHTML = pvm;
            cells[1].innerHTML = category;
            cells[2].innerHTML = exercise;
            cells[3].innerHTML = kesto;
            cells[4].innerHTML = fiilis;
    
            break; //breaks the loop after the selected row had been found and upadated
        }
    }
    
    //The updated values are saved to local storage 
    var harjoitusData = JSON.parse(localStorage.getItem("harjoitukset")) || [];
    harjoitusData[rIndex - 1] = {
        pvm: pvm,
        category: category,
        exercise: exercise,
        kesto: kesto,
        fiilis: fiilis
    };
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitusData));

    informationSummary();
}


//Create dynamic evetnt to updateHarjoitus
updateHarjoitus.addEventListener('click', updateData);

var table = document.getElementById("harjoitusTaulu");

//Delete exercise-row
function deleteData(e) {
    e.preventDefault(); 

    var place = document.getElementById("harjoitusTaulu");
    var tableRows = place.getElementsByTagName('tr');

    //delete selected row
    tableRows[rIndex].remove();

    //get the data from local storage, remove data and update 
    var harjoitusData = JSON.parse(localStorage.getItem("harjoitukset")) || [];
    harjoitusData.splice(rIndex - 1, 1); 
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitusData));


    // clear input text from form
    document.getElementById('pvm').value = "";
    document.getElementById('valikko').value = "";
    document.getElementById('harjoitus').value = "";
    document.getElementById('kesto').value = "";
    document.getElementById('fiilis').value = "";

    informationSummary();

}

//Create dynamic evetnt to deleteHarjoitus
deleteHarjoitus.addEventListener('click', deleteData);



//////////////////////SUMMARY ABOUT EXERCISES///////////////

function informationSummary() {

    //get information from the table
    var place = document.getElementById("harjoitusTaulu");

    //how many exercises
    var tableRows = place.getElementsByTagName('tr');
    var maara = tableRows.length - 1;

    //duration of all exercises
    var kestoYhteensa = 0;
    for (var i = 1; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName('td');
        var kestoMerkki = cells[3].innerHTML.replace(/<[^>]+>/g, ''); //cells[3] value is <td>1</td>, need to remove html-tags
        kestoNro = parseFloat(kestoMerkki); //need to change string to numbers
        kestoYhteensa += kestoNro;
    }


    //average duration of exercise
    var kestoKa = (kestoYhteensa / maara).toFixed(2);

    //exercise count by categories
    //obejct to save exercise by category
    var maaraKategorioittain = {
        Peruskestavyys: 0,
        Kardioliikunta: 0,
        Lihaskunto: 0,
        Kehonhuolto: 0,
        Muu: 0
    }

    //Go through all rows one by one
    for (var i = 1; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName('td');
        var category = cells[1].innerHTML; 
    
        //Add +1 to correct category in maaraKategorioittain
        maaraKategorioittain[category]++;
    }

    var tulostus = '<br><br><u>Harjoitukset kategorioittain: </u><br>';
    for(var category in maaraKategorioittain){
        tulostus += category + ": " + maaraKategorioittain[category] + '<br>';
    }

    //place where to load the information
    var paikka = document.getElementById("tiedot");

    //Loading to the yhteenveto
    paikka.innerHTML = 
    '<u>Harjoitukset yhteensä:</u> ' + maara + 
    '<br><br><u>Harjoitusten kesto yhteensä: </u>' + kestoYhteensa +
    '<br><br><u>Harjoitusten kesto keskimäärin: </u>' + kestoKa +
    tulostus;

}




///////////////////////CHANGING THE STYLES///////////////////////


//Changing the theme for the page
//Possible theme choices
const uinti = document.getElementById('uinti');
const rauha = document.getElementById('rauha');
const iloinen = document.getElementById('iloinen');
const voima = document.getElementById('voima');

//Default theme
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

    //function so change picture
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
    

    //changes according to theme (colors, pictures)
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

