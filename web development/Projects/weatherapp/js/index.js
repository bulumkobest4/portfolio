const apikey = "4b5e14300e394db9929133901230807"
const searchButton = document.getElementById("search-button");
const userLocation = document.getElementById("location");
const weatherLocation = document.getElementById("city")
const temp = document.getElementById("temp")
const feel = document.getElementById("type")
const daily = document.getElementById("date")
const img = document.getElementById("img")
const yesterdayButton = document.getElementById("yesterday")
const tomorrowButton = document.getElementById("tomorrow")
const searchPopup = document.getElementById("search-results")
const year = new Date().getFullYear();
const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
const day = String(new Date().getDate()).padStart(2, '0');
const todayDate  = `${year}-${month}-${day}`;
const yesterdayDate = `${year}-${month}-`+"0"+`${day-1}`;

window.addEventListener("load",()=>{
    daily.textContent = todayDate;
    get_location();
});
searchButton.addEventListener("click",()=>{
    get_weather(userLocation.value)
    get_tomorrow(userLocation.value)
    get_yesterday(userLocation.value)
})

function get_location(){
    fetch('https://ipapi.co/json/')
    .then((response) => {
    response.json().then(jsonData => {
        get_weather(jsonData.city);
        get_tomorrow(jsonData.city)
        get_yesterday(jsonData.city)
    });
    })
    .catch(error =>console.log(error));
}

function get_weather(city){
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`)
    .then((response)=>{
        response.json().then( data =>{
            userLocation.value = data["location"]["name"]
            weatherLocation.textContent = data["location"]["name"]+", "+ data["location"]["country"]
            temp.textContent =` ${data["current"]["temp_c"]} * C`
            feel.textContent = data["current"]["condition"]["text"]
            img.src = "http:"+data["current"]["condition"]["icon"]
            console.log(data)
        }).catch((error)=>{
            console.log("Error")
        })
    })
}
function get_tomorrow(city){
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=2`)
    .then((response)=>{
        response.json().then((data)=>{

            tomorrowButton.onclick = () => {
                if(yesterdayButton.textContent == "Today"){
                    yesterdayButton.textContent = "Yesterday"
                }
                if(tomorrowButton.textContent == "Today"){
                    window.location.reload()
                }
                
                daily.textContent = data["forecast"]["forecastday"][1]["date"]
                userLocation.value = data["location"]["name"]
                weatherLocation.textContent = data["location"]["name"]+", "+ data["location"]["country"]
                temp.textContent =` ${data["forecast"]["forecastday"][1]["day"]["avgtemp_c"]} * C`
                feel.textContent = data["forecast"]["forecastday"][1]["day"]["condition"]["text"]
                img.src = "http:"+data["forecast"]["forecastday"][1]["day"]["condition"]["icon"]
                tomorrowButton.textContent = "Today"
            }
            console.log(data)
        }).catch((error)=>{
            console.log("Error")
        })
    })
}
function get_yesterday(city){
    fetch(`http://api.weatherapi.com/v1/history.json?key=${apikey}&q=${city}&dt=${yesterdayDate}`)
    .then((response)=>{
        response.json().then((data)=>{
            yesterdayButton.onclick = () => {
                if(tomorrowButton.textContent == "Today"){
                    tomorrowButton.textContent = "Tomorrow"
                }
                if(yesterdayButton.textContent == "Today"){
                    window.location.reload();
                }
                
                daily.textContent = yesterdayDate
                userLocation.value = data["location"]["name"]
                weatherLocation.textContent = data["location"]["name"]+", "+ data["location"]["country"]
                temp.textContent =` ${data["forecast"]["forecastday"][0]["day"]["avgtemp_c"]} * C`
                feel.textContent = data["forecast"]["forecastday"][0]["day"]["condition"]["text"]
                img.src = "http:"+data["forecast"]["forecastday"][0]["day"]["condition"]["icon"]
                yesterdayButton.textContent = "Today"
            }
            console.log(data);
        }).catch((error)=>{
            document.querySelector("temp-container").innerHTML = "Sorry, try again"
        })
    })
}