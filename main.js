const url =
 "http://api.weatherstack.com/current?access_key=3d129da01f0d3b79f20494cf22346e8b"


 const root = document.querySelector('#root')
 const popup = document.getElementById('popup')
 const textInput = document.getElementById('text-input')
 const form = document.getElementById('form')

 let store = {
   city:'Moscow',
   feelslike:0,
   temperature:0,
   observation_time:'00:00 AM',
   is_day:'yes',
   description:'',
   properties:{
     cloudcover:{},
     wind_speed:{},
     visibility:{},
     uv_index:{},
     pressure:{},
     humidity:{},
   }
 }
 

 const fetchData = async () => {
    try{

      const query = localStorage.getItem('query') || store.city
      const result = await fetch(`${url}&query=${query}`)
      const data = await result.json()

      const {current:{
         cloudcover,
         temperature,
         observation_time:observationTime,
         uv_index:uvIndex,
         humidity,
         visibility,
         is_day:isDay,
         pressure,
         wind_speed:windSpeed,
         weather_descriptions:description
        },
            location:{name}} = data

            store = {
               ...store,
               city:name,
               temperature,
               observationTime,
               isDay,
               description,
               properties: {
                cloudcover: {
                  title: "cloudcover",
                  value: `${cloudcover}%`,
                  icon: "cloud.png",
                },
                humidity: {
                  title: "humidity",
                  value: `${humidity}%`,
                  icon: "humidity.png",
                },
                windSpeed: {
                  title: "wind speed",
                  value: `${windSpeed} km/h`,
                  icon: "wind.png",
                },
                pressure: {
                  title: "pressure",
                  value: `${pressure} %`,
                  icon: "gauge.png",
                },
                uvIndex: {
                  title: "uv Index",
                  value: `${uvIndex} / 100`,
                  icon: "uv-index.png",
                },
                visibility: {
                  title: "visibility",
                  value: `${visibility}%`,
                  icon: "visibility.png",
                },
              },
            }
      renderComponent()
    } catch(err){
        console.log(err)
    }
 }


 const getImage = (description) => {
    if(description == 'Partly cloudy') return 'partly.png'
    else if(description == 'Sunny') return 'sunny.png'
    else if(description == 'Cloud') return 'cloud.png'
    else if(description == 'fog') return 'fog.png'
    else if(description == 'Sunny') return 'sunny.png'
    else if(description == 'Clear') return 'clear.png' 
    else  return 'the.png'
 }

 const renderProperty = (properties) => {

  return Object.values(properties).map(data => {
    const {title,value,icon} = data

    return `<div class="property">
             <div class="property-icon">
             <img src="./icon/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
         </div>`
  }).join('')
 }


 const markup = () => {

  const {city,description,observationTime,temperature ,isDay, properties} = store

  const containerClass = isDay === 'yes' ? 'is-day' : ' '

  return `<div class="container ${containerClass }">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="/img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>
      `
}

const togglePopupClass = () => {
  popup.classList.toggle('active')
}

const renderComponent = () => {
  root.innerHTML = markup()

  const city = document.getElementById('city')
  city.addEventListener('click',togglePopupClass)
}

const hendleInput = (e) => {
  store = {
    ...store,
    city:e.target.value
  }
}

const hendleSubmit = (e) => {
  e.preventDefault()

  let val = store.city

  if(!val) return null

  localStorage.setItem('query',val)
  fetchData()
  togglePopupClass()

  textInput.value = ''
}

form.addEventListener('submit',hendleSubmit)
textInput.addEventListener('input',hendleInput)

 fetchData()