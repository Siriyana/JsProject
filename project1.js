
if(localStorage.getItem("users")==null){
    var user = [];
    localStorage.setItem("users", JSON.stringify(user));
}

if(localStorage.getItem("harjoitukset")==null){
    var harjoitus = [];
    localStorage.setItem("harjoitukset", JSON.stringify(harjoitus));
}

//Element variables, personalInfo-form and submitUser-button
const personalInfo = document.getElementById('personalInfo');
const submitUser = document.getElementById('submitUser');

function processUser(e) {
    e.preventDefault();

    var user = JSON.parse(localStorage.getItem("users")) || [];


    //Variables in user
    var name = document.getElementById("nimi").value;
    var email = document.getElementById("sposti").value;

    // Create a new user
    var varausTiedot = {
        name: name,
        email: email,
    }

    // Save user to localstorage
    user.push(varausTiedot);
    localStorage.setItem("users", JSON.stringify(user));


    //Say hi to user

}

//Add dynamic event to button
submitUser.addEventListener('click', processUser);

//Element variables, harjoitusTiedot-form and submitHarjoitus-button
const harjoitusTiedot = document.getElementById('harjoitusTiedot');
const submitHarjoitus = document.getElementById('submitHarjoitus');


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

}


//Create dynamic event to submitHarjoitus-button
submitHarjoitus.addEventListener('click', saveData);


//Changing the theme colors for the page
function changeStyle() {

}
