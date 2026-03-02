// ===============================
// 1. GET ALL HTML ELEMENTS
// ===============================

// We use document.getElementById to connect JavaScript to HTML elements

const countryInput = document.getElementById("country-input");
const searchButton = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfoSection = document.getElementById("country-info");
const borderingCountriesSection = document.getElementById("bordering-countries");
const errorMessageDiv = document.getElementById("error-message");


// ===============================
// 2. ADD EVENT LISTENERS
// ===============================

// When the button is clicked, call the searchCountry function
searchButton.addEventListener("click", function () {
    searchCountry();
});

// When the user presses a key inside the input
countryInput.addEventListener("keypress", function (event) {
    // If the key pressed is "Enter"
    if (event.key === "Enter") {
        searchCountry();
    }
});


// ===============================
// 3. MAIN FUNCTION TO SEARCH COUNTRY
// ===============================

async function searchCountry() {

    // Get the value from the input box
    const countryName = countryInput.value;

    // If input is empty, stop the function
    if (countryName === "") {
        return;
    }

    // Clear old data before new search
    clearPreviousResults();

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");

    try {
        // Fetch data from REST Countries API
        const response = await fetch(
            "https://restcountries.com/v3.1/name/" + countryName
        );

        // If the country does not exist
        if (response.ok === false) {
            throw new Error("Country not found");
        }

        // Convert response to JSON
        const data = await response.json();

        // The API returns an array, we take the first result
        const country = data[0];

        // Display main country information
        displayCountryInformation(country);

        // Display bordering countries if they exist
        if (country.borders) {
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


// ===============================
// 4. DISPLAY MAIN COUNTRY INFO
// ===============================

function displayCountryInformation(country) {

    // Show the country info section
    countryInfoSection.classList.remove("hidden");

    // Format population with commas
    const formattedPopulation = country.population.toLocaleString();

    // Insert HTML into the section
    countryInfoSection.innerHTML =
        "<h2>" + country.name.common + "</h2>" +
        "<img src='" + country.flags.png + "' width='150'>" +
        "<p><strong>Capital:</strong> " + 
            (country.capital ? country.capital[0] : "N/A") + "</p>" +
        "<p><strong>Population:</strong> " + formattedPopulation + "</p>" +
        "<p><strong>Region:</strong> " + country.region + "</p>";
}


// ===============================
// 5. DISPLAY BORDERING COUNTRIES
// ===============================

async function displayBorderingCountries(borderCodes) {

    // Show bordering countries section
    borderingCountriesSection.classList.remove("hidden");

    // Add a title
    borderingCountriesSection.innerHTML = "<h3>Bordering Countries:</h3>";

    // Loop through each border country code
    for (let i = 0; i < borderCodes.length; i++) {

        const code = borderCodes[i];

        // Fetch each bordering country using its code
        const response = await fetch(
            "https://restcountries.com/v3.1/alpha/" + code
        );

        const data = await response.json();
        const borderCountry = data[0];

        // Create a new div for each bordering country
        const div = document.createElement("div");

        div.innerHTML =
            "<img src='" + borderCountry.flags.png + "' width='80'>" +
            "<p>" + borderCountry.name.common + "</p>";

        // Add it to the section
        borderingCountriesSection.appendChild(div);
    }
}


// ===============================
// 6. CLEAR OLD RESULTS
// ===============================

function clearPreviousResults() {

    // Hide sections
    countryInfoSection.classList.add("hidden");
    borderingCountriesSection.classList.add("hidden");
    errorMessageDiv.classList.add("hidden");

    // Clear previous content
    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";
}