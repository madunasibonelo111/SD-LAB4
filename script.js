// tested this, from the console and with the live server extention so everthing works alright.


// so i first have to get all html elements

// using document.getElementById to connect javascript to html elements

const countryInput = document.getElementById("country-input");
const searchButton = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfoSection = document.getElementById("country-info");
const borderingCountriesSection = document.getElementById("bordering-countries");
const errorMessageDiv = document.getElementById("error-message");


// i am gonna put the event listener here

// when the button is pressed on, i want to call the searchCountry function
searchButton.addEventListener("click", function () {
    searchCountry();
});

// when the user presses a key inside the input
countryInput.addEventListener("keypress", function (event) {
    // If the key pressed is "Enter"
    if (event.key === "Enter") {
        searchCountry();
    }
});

// this is my main method to search the countries


async function searchCountry() {

    // get my value from the input box after i input
    const countryName = countryInput.value.trim(); // trim whitespace

    // if input is empty, stop the function
    if (countryName === "") {
        return;
    }

    // move the old data before new search
    clearPreviousResults();

    // show loading spinner
    loadingSpinner.classList.remove("hidden");

    try {
        // fetching data from rest countries api
        const response = await fetch(
            "https://restcountries.com/v3.1/name/"+countryName
        );

        // if the country does not exist
        if (response.ok===false){
            throw new Error("Country not found");
        }

        // convert response to json
        const data=await response.json();

        // this api returns an array, we try to find exact match first
        const country = data.find(function(c){ // exact name match
            return c.name.common.toLowerCase() === countryName.toLowerCase();
        }) || data[0]; // fallback to first

        // show main country information
        displayCountryInformation(country);

        // Display bordering countries if they exist
        if (country.borders && country.borders.length > 0){ // checking length
            displayBorderingCountries(country.borders);
        }

    } catch (error) {
        // If something goes wrong, show error message
        errorMessageDiv.textContent = "Country not found. Please try again.";
        errorMessageDiv.classList.remove("hidden");
    }

    // Hide loading spinner after everything is done
    loadingSpinner.classList.add("hidden");
}

function displayCountryInformation(country) {

    // Show the country info section
    countryInfoSection.classList.remove("hidden");

    // Format population with commas
    const formattedPopulation = country.population.toLocaleString();

    // Insert HTML into the section
    countryInfoSection.innerHTML =
        "<h2>" + country.name.common + "</h2>" +
        "<img src='" + country.flags.svg + "' width='150'>" + // used svg
        "<p><strong>Capital:</strong> " + 
            (country.capital ? country.capital[0] : "N/A") + "</p>" +
        "<p><strong>Population:</strong> " + formattedPopulation + "</p>" +
        "<p><strong>Region:</strong> " + country.region + "</p>";
}

// sdisplaying the bordering countries

async function displayBorderingCountries(borderCodes) {

    // bordering country section here
    borderingCountriesSection.classList.remove("hidden");
    borderingCountriesSection.innerHTML = "<h3>Bordering Countries:</h3>";

    // got this help from chatgpt ... although i understand here.
    for (let i = 0; i < borderCodes.length; i++) {

        const code = borderCodes[i];

        // fetch each bordering country using its code
        const response = await fetch(
            "https://restcountries.com/v3.1/alpha/" + code
        );

        const data = await response.json();
        const borderCountry = data[0];

        // make a new div for each bordering country
        const div = document.createElement("div");
        div.className = "country-card";

        div.innerHTML =
            "<img src='" + borderCountry.flags.svg + "' width='80'>" + // using svg now
            "<p>" + borderCountry.name.common + "</p>";

        // add it to the section
        borderingCountriesSection.appendChild(div);
    }
}

// move old results

function clearPreviousResults() {

    // hide the sections
    countryInfoSection.classList.add("hidden");
    borderingCountriesSection.classList.add("hidden");
    errorMessageDiv.classList.add("hidden");

    // moving previous content
    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";
}