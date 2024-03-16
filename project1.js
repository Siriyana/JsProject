
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





//Changing the theme colors for the page
function changeStyle() {

}
