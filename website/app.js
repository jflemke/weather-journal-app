/* Global Variables */
// ### API Key shouldn't be commited to a public github repo ###
const API_KEY = '';
const base_url_owm = 'http://api.openweathermap.org/data/2.5';
const base_url_local = 'http://localhost:8002';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+ (d.getMonth()+1) +'.'+ d.getFullYear();

// adding eventListener
document.getElementById('generate').addEventListener('click', generateJournalEntry);


// GET data from OpenWeatherMap async
const getWeatherByZipCode = async (zipCode = '', apiKey = '') => {
    const response = await fetch(`${base_url_owm}/weather?zip=${zipCode},de&APPID=${apiKey}`);
    try {
        const responseData = await response.json();
        console.log(responseData);
        return responseData.main.temp;
    } catch(error) {
        console.error(error);
    }
};

const postJournalEntry = async (date, temp, content) => {
    const response = await fetch(`${base_url_local}/entry`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({date: date, temp: temp, content: content})
    });

    try {
        return await response.json();
    } catch(error) {
        console.error(error);
        return {error: error};
    }
};

function generateJournalEntry() {
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherByZipCode(zipCode, API_KEY)
        .then( (temp) => {
            return postJournalEntry(newDate, temp, feelings);
        })
        .then( (entry) => {
            document.getElementById('date').innerHTML = entry.date;
            document.getElementById('temp').innerHTML = `${entry.temp} °F`;
            document.getElementById('content').innerHTML = `You were feeling: ${entry.content}`;
        });
}
