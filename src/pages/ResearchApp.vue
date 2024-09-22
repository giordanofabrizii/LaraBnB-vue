<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import MapApp from '../components/MapApp.vue';
import { store } from '../store';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: "search",
    components: {
        MapApp
    },
    data() {
        return {
            citySearched: '',
            isOpen: false,
            apartments: [],
            store,
            services: [
                    { name: 'Aria Condizionata' },
                    { name: 'Piscina' },
                    { name: 'Giardino' },
                    { name: 'Vista cortile interno' },
                    { name: 'Portico' },
                    { name: 'Lavastoviglie' },
                    { name: 'Lavatrice' },
                    { name: 'Wifi' },
                    { name: 'Smart-Tv' },
                    { name: 'Barbecue' },
                    { name: 'Vasca da Bagno' },
                    { name: 'Jacuzzi' },
                    { name: 'Ascensore' },
                    { name: 'Accessibilità' },
                    { name: 'Riscaldamento' },
                    { name: 'Microonde' },
                    { name: 'Parcheggio' },
                    { name: 'Bidet' },
                    { name: 'Ferro da Stiro' },
                    { name: 'Kit di pronto soccorso' },
                    { name: 'Macchina del caffè' },
                ],
            filters: {
                surface_min: null,
                surface_max: null,
                room_number: null,
                bath_number: null,
                bed_number: null,
                latitude: null,
                longitude: null,
                radius: 10000,
                price: null,
                services: [],
            },
            // isSearchExectuted: false,

        };
    },
    methods: {
        increaseValue(field) {
            if (field === 'surface_min'){
                this.filters[field] += 10;
                this.updateUrlWithFilters()
            }
            else if(field == 'surface_max'){
                this.filters[field] += 10;
                this.updateUrlWithFilters()
            }
            else{
                this.filters[field] += 1; // Incrementa il valore di surface_min
                this.updateUrlWithFilters();   // Aggiorna l'URL con i filtri
            }
        },
        decreaseValue(field) {
            if (this.filters[field] > 0) {
                if (field == 'surface_min'){
                    this.filters[field] -= 10; // Decrementa il valore di surface_min (ma non sotto zero)
                    this.updateUrlWithFilters();   // Aggiorna l'URL con i filtri
                } else if(field == 'surface_max') {
                    this.filters[field] -= 10; // Decrementa il valore di surface_min (ma non sotto zero)
                    this.updateUrlWithFilters();   // Aggiorna l'URL con i filtri
                }
                else{
                    this.filters[field] -= 1; // Decrementa il valore di surface_min (ma non sotto zero)
                    this.updateUrlWithFilters();   // Aggiorna l'URL con i filtri
                }
            }
        },
        async cercaAppartamenti() {
            try {
                this.updateUrlWithFilters();

                const response = await axios.get('http://127.0.0.1:8000/api/apartments', {
                    params: this.filters,
                });

                // Calculate the distance for each apartment
                this.store.apartments = response.data.map(apartment => {
                    if (this.filters.latitude && this.filters.longitude) {
                        apartment.distance = this.calculateDistance(
                            this.filters.latitude,
                            this.filters.longitude,
                            apartment.latitude,
                            apartment.longitude
                        );
                    } else {
                        apartment.distance = null;
                    }
                    return apartment;
                });
            } catch (error) {
                console.error('ERRORE', error);
            }
        },
        capitalizeFirstLetter(city) {
            if (!city) return '';
            city = city.toLowerCase(); // Converti tutto in minuscolo
            return city.charAt(0).toUpperCase() + city.slice(1); // Prima lettera maiuscola
        },
        updateUrlWithFilters(){
            const query = Object.assign({}, this.filters);
            this.$router.push({ query });
        },
        updateCoordinates(coordinates) {
            this.filters.latitude = coordinates.lat;
            this.filters.longitude = coordinates.lng;
        },
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = this.degToRad(lat2 - lat1);
            const dLon = this.degToRad(lon2 - lon1);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // distance in km
            return distance;
        },
        // Function to convert degrees to radians
        degToRad(deg) {
            return deg * (Math.PI / 180);
        },
        views: function(id) {
            let data = {
                ip: null,
                apartment_id: id,
            };

            axios.get('https://api.ipify.org?format=json')
            .then((response) => {
                data.ip = response.data.ip; // Takes the IP address from the response

                // Adds a view to the apartment
                axios.post('http://127.0.0.1:8000/api/apartments/view', {
                    apartment_id: data.apartment_id,
                    ip: data.ip,
                });
            })
            .catch((error) => {
                console.error('Errore nel recupero dell\'IP:', error);
            });
        },
        resolveUrl(slug) {
            // Usa Vue Router per risolvere il percorso
            const url = this.$router.resolve({ name: 'SingleApartment', params: { slug } }).href;
            return url;
        },
    },
    mounted() {
        this.$nextTick(() => {
            const citySearched = this.$route.query.city; // Saves the city searched
            if (citySearched) {
                this.citySearched = citySearched;
                this.filters.latitude = this.$route.query.latitude; // Saves the latitude 
                this.filters.longitude = this.$route.query.longitude; // Saves the longitude
            }
            this.cercaAppartamenti(); // Uploads the apartments
            let position = {
                lat: this.filters.latitude,
                lng: this.filters.longitude,
            };

            if (this.filters.latitude != null) {
                // Add the map to the page
                const map = tt.map({
                    key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU", // API's key
                    container: "map", // Map's container
                    center: [this.filters.longitude, this.filters.latitude], // 
                    zoom: 14, // Initial zoom
                });

                setTimeout(() => {
                    map.resize(); // Resize the map after it's loaded
                    console.log("Mappa caricata correttamente"); // Test
                }, 200);

                // Crea il marker nella posizione specificata
                const marker = new tt.Marker()
                    .setLngLat([position.lng, position.lat]) // Uses the position saved
                    .setPopup(new tt.Popup({ offset: 5 }).setHTML(`
                        <h1>${citySearched}</h1>
                        <p>Latitudine: ${position.lat}, Longitudine: ${position.lng}</p>
                    `)) // Popup personalized
                    .addTo(map);

                // Move the map to the position with flyTo
                map.flyTo({
                    center: [position.lng, position.lat], // Center on the position
                    zoom: 14 
                });
            }
        });
    },
    computed: {
        // Proprietà calcolata per formattare il nome della città
        formattedCityName() {
            return this.capitalizeFirstLetter(this.citySearched);
        },
    },
};
</script>

<template>
    <div id="research-app">
        <aside>
            <section  class="side">
                <div class="upper-srcbtn">
                    <button class="search" id="search-btn" @click="cercaAppartamenti">Carica Appartamenti</button>
                </div>

                    <MapApp :latitude="filters.latitude" :longitude="filters.longitude" @update-coordinates="updateCoordinates" class="map"/>
                
                    <section class="dropdown-content">
            

                    <!-- SURFACE SELECTOR -->
                    <!-- MIN SURFACE -->
                    <div class="wholeInput">
                        <label for="minSurface">Superficie Minima(m&sup2;)</label>
                        <div class="custom-number-input">
                        <button type="button" class="decrement" @click="decreaseValue('surface_min')">-</button>
                        <input v-model.number="filters.surface_min" @input="updateUrlWithFilters" placeholder="0" type="number" id="minSurface">
                        <button type="button" class="increment" @click="increaseValue('surface_min')">+</button>
                        </div>
                    </div>
                    
                    <!-- MAX SURFACE -->
                    <div class="wholeInput">
                        <label for="maxSurface">Superficie Massima(m&sup2;)</label>
                        <div class="custom-number-input">
                        <button type="button" class="decrement" @click="decreaseValue('surface_max')">-</button>
                        <input v-model.number="filters.surface_max" @input="updateUrlWithFilters" placeholder="0" type="number" id="maxSurface">
                        <button type="button" class="increment" @click="increaseValue('surface_max')">+</button>
                        </div>
                    </div>

                    <!-- ROOM MIN VALUE -->
                    <div class="wholeInput">
                        <label for="room">Numero di stanze</label>
                        <div class="custom-number-input">
                        <button type="button" class="decrement" @click="decreaseValue('room_number')">-</button>
                        <input v-model.number="filters.room_number" @input="updateUrlWithFilters" placeholder="0" type="number" id="room">
                        <button type="button" class="increment" @click="increaseValue('room_number')">+</button>
                        </div>
                    </div>

                    <!-- BATH MIN VALUE -->
                    <div class="wholeInput">
                        <label for="bath">Numero di bagni</label>
                        <div class="custom-number-input">
                        <button type="button" class="decrement" @click="decreaseValue('bath_number')">-</button>
                        <input v-model.number="filters.bath_number" @input="updateUrlWithFilters" placeholder="0" type="number" id="bath">
                        <button type="button" class="increment" @click="increaseValue('bath_number')">+</button>
                        </div>
                    </div>

                    <!-- BED MIN VALUE -->
                    <div class="wholeInput">
                        <label for="bed">Numero di letti</label>
                        <div class="custom-number-input">
                        <button type="button" class="decrement" @click="decreaseValue('bed_number')">-</button>
                        <input v-model.number="filters.bed_number" @input="updateUrlWithFilters" placeholder="0" type="number" id="bed">
                        <button type="button" class="increment" @click="increaseValue('bed_number')">+</button>
                        </div>
                    </div>

                    <!-- LATITUDE VALUE -->
                    <input id="latitude" v-model.number="filters.latitude" @input="updateUrlWithFilters" placeholder="Latitudine" type="hidden">

                    <!-- LONGITUDE VALUE -->
                    <input id="longitude" v-model.number="filters.longitude" @input="updateUrlWithFilters" placeholder="Longitudine" type="hidden">
                </section>

                
                <!-- RADIUS -->
                <div class="radius">
                    <h2 class="radius-title">Raggio di ricerca:</h2>
                    <div class="search-radius">
                        <input v-model.number="filters.radius" min="1000" max="20000" @input="updateUrlWithFilters"  type="range">
                        <span>{{ (filters.radius / 1000).toFixed(1) }} km</span>
                    </div>                    
                </div>  

                <div class="more-filters">
                    <!-- SERVICES-->
                    <div class="services">
                        <h2>Servizi</h2>
                        <div class="services-list">
                            <article class="services-item" v-for="service in services" :key="service.name">
                                <label class="checkbox">
                                <input type="checkbox" class="checkbox__trigger visuallyhidden":value="service.name" v-model="filters.services" @change="updateUrlWithFilters">
                                <span class="checkbox__symbol">
                                    <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                    </svg>
                                </span>
                                <p class="checkbox__textwrapper">{{ service.name }}</p>
                                </label>
                            </article>
                        </div>                        
                    </div>
                </div>

                <button class="search" id="search-btn" @click="cercaAppartamenti">Carica Appartamenti</button>
                
            </section>
        </aside>
            
        <section class="apartments">
            
            <h1 v-if="citySearched != ''" class="city">{{formattedCityName}}: {{ store.apartments.length }} strutture trovate</h1>
            
            <ul class="apartment-list">
                <a v-for="apartment in store.apartments" :key="apartment.id"
                :href="resolveUrl(apartment.slug)"  target="_blank" @click="views(apartment.id)">
                    <li class="apartment-item" >
                        <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="apartment image">
                        <div class="overlay">
                            <h1>{{ apartment.name }}</h1>
                            <p>{{ apartment.description }}</p>  
                            <p>{{ apartment.address }}</p>   
                            <div class="info">
                                <div>
                                    <p>Stanze: {{ apartment.n_room }}</p>
                                    <p>Bagni: {{ apartment.n_bath }}</p>
                                    <p>Superficie: {{ apartment.surface }} m&sup2;</p>
                                </div>
                                <div class="last-info">
                                    <div class="person">
                                        <p>1 notte, {{ apartment.n_bed }} <span v-if="apartment.n_bed == 1">Persona</span>
                                        <span v-if="apartment.n_bed > 1">Persone</span></p>
                                        <i v-for="bed in apartment.n_bed" :key="bed" class="fas fa-user"></i>
                                    </div>
                                    <strong> &euro; {{ apartment.price}}</strong>
                                    <p>Include tasse e costi</p>
                                </div>
                            </div>
                            <p>Distanza: {{ (Math.round((calculateDistance(apartment.latitude, apartment.longitude, filters.latitude, filters.longitude)) * 100) / 100).toFixed(2)  }} km</p>       
                        </div>
                    </li>
                </a>
            </ul>
        
            <div class="no-results" v-if="store.apartments.length === 0">
                <h3>Purtroppo non sono presenti appartamenti disponibili</h3>
                <p>Effettua una nuova ricerca</p>
            </div>
        </section>
    </div>   
</template>

<style scoped lang="scss">
@use '../style/partials/variables' as *;

a {
    text-decoration: none;
    color: black;
}

#research-app{
    display: flex;
    padding: 2rem;
    width: 100vw;
}

.map{
    border-radius: 15px;
}

.side {
    max-width: 336px;
    margin: 0 auto 1rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    background-color: white;
    border-radius: 1rem;
    border: 1px solid rgb(214, 214, 214);

    .custom-number-input {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: .5rem;
    }

    .wholeInput{
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    button.increment,
    button.decrement {
        border-radius:.5rem;
        width: 30px;
        height: 30px;
        background-color: white;
        border: none;
        cursor: pointer;
    }

    button.increment:hover,
    button.decrement:hover {
        background-color: #ddd;
    }

    input[type="number"] {
        width: 2rem;
        text-align: center;
        border: none;
        -webkit-appearance: none; /* Nascondi le frecce in Chrome */
        -moz-appearance: textfield; /* Nascondi le frecce in Firefox */
    }

    .upper-srcbtn{
        margin: 0.2rem auto;
    }

    button.search{
        padding: 1rem 2rem 1rem 2rem;
        width: 15rem;
        margin: 1rem auto;
        border: none;
        border-radius: 2rem;
        background-color: #2f408e;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.181);
        align-self: center;

        &:hover{
            background-color: #7288ee;
            transform: translateY(-2px);
        }
    }

    .dropdown-content {
        padding: 1rem;
        border-top: solid 1px rgb(214, 214, 214);
        border-bottom: solid 1px rgb(214, 214, 214);


        .filters{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            margin: 1rem;

            input{
                padding: .2rem;
                border-radius: 5px;
                margin: 1rem;
            }
        }
    }

    .more-filters{
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-bottom: 1px solid rgb(214, 214, 214);
    }
}

.radius{
    border-bottom: 1px solid rgb(214, 214, 214);
    .search-radius{
        margin: 1rem auto;
        align-self: center;
        p{
            margin-bottom: .3rem;
        }
    }
}

.apartments{
    width: 100%;

    h1.city{
        color: white;
        text-align: center;
    }

.apartment-list {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;

    > a{
        width: 90%;
    }
}

.apartment-item {
    display: flex;
    border: 1px solid #060342;
    border-radius: 24px;
    margin: 1rem;
    padding: 1rem;
    box-shadow: rgba(255, 255, 255, 0.3) 0 5vw 6vw -8vw, rgba(255, 255, 255, 0) 0 4.5vw 5vw -6vw, rgba(50, 50, 80, 0.5) 0px 4vw 8vw -2vw, rgba(0, 0, 0, 0.8) 0px 4vw 5vw -3vw;
    overflow: hidden;
    transition: .3s ease;
    background-color: #bebebe9a;
    width: 100%;

    a{
        width: 100%;
    }

    img{
        height: 20rem;
        display: block;
        border-radius: 24px;
        aspect-ratio: 1 / 1;
        object-fit: cover;
    }

    .overlay {

        overflow: hidden;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        h1{
            color: white;
            margin: 1rem;
        }

        p{
            color: white;
            padding-left: 1rem;
            padding-bottom: 1rem;
        }
        .info{
            margin-left: 1rem;
            display: flex;
            justify-content: space-between;
            border-left: 4px solid #528fff81;
            p{
                padding-left: .5rem;
            }
            .last-info{
                text-align: end;
                p{
                    padding-bottom: 0;
                }
                p:last-child{
                    font-size: .7rem;
                }
                strong{
                    font-size: 1.5rem;
                }
            }
        }
    }

    &:hover{
        transform: scale(1.05);
    }
}
}
.services{
    display: flex;
    flex-direction: column;
    
    h2{
        margin-bottom: 1rem;
    }
        
}
.no-results{
    color: white;
    text-align: center;
    padding-bottom: 3rem;
}

#map{
    margin: 1rem;
        height: 150px;
        width: 300px;
        
    }
    .radius-title{
        
        margin: .5rem 1rem;
    }
    .search-radius {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }
.search-radius input[type="range"] {
    margin: 0 10px;
    cursor: pointer;
    }
.search-radius span {
    font-weight: bold;
    margin-left: 1rem;
    }
    //checkbox CSS
    .services-list {
        --s-xsmall: 0.625em;
        --s-small: 1.2em;
        --border-width: 1px;
        --c-primary: #000000f5;
        --c-primary-20-percent-opacity: rgba(0, 0, 0, 0.2);
        --c-primary-10-percent-opacity: rgba(0, 0, 0, 0.1);
        --t-base: 0.4s;
        --t-fast: 0.2s;
        --e-in: ease-in;
        --e-out: cubic-bezier(.11,.29,.18,.98);
        }
    
        .services-list .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        }
    
        .services-list .checkbox {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: .5rem;
        }
        .services-list .checkbox + .checkbox {
        margin-top: var(--s-small);
        }
        .services-list .checkbox__symbol {
        display: inline-block;
        display: flex;
        margin-right: calc(var(--s-small) * 0.7);
        border: var(--border-width) solid var(--c-primary);
        position: relative;
        border-radius: 0.1em;
        width: 1.5em;
        height: 1.5em;
        transition: box-shadow var(--t-base) var(--e-out), background-color var(--t-base);
        box-shadow: 0 0 0 0 var(--c-primary-10-percent-opacity);
        cursor: pointer;
        }
        .services-list .checkbox__symbol:after {
        content: "";
        position: absolute;
        top: 0.5em;
        left: 0.5em;
        width: 0.25em;
        height: 0.25em;
        background-color: var(--c-primary-20-percent-opacity);
        opacity: 0;
        border-radius: 3em;
        transform: scale(1);
        transform-origin: 50% 50%;
        }
        .services-list .checkbox .icon-checkbox {
        width: 1em;
        height: 1em;
        margin: auto;
        fill: none;
        stroke-width: 3;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 10;
        color: var(--c-primary);
        display: inline-block;
        }
        .services-list .checkbox .icon-checkbox path {
        transition: stroke-dashoffset var(--t-fast) var(--e-in);
        stroke-dasharray: 30px, 31px;
        stroke-dashoffset: 31px;
        }
        .services-list .checkbox__textwrapper {
        margin: 0;
        }
        .services-list .checkbox__trigger:checked + .checkbox__symbol:after {
        -webkit-animation: ripple-33 1.5s var(--e-out);
                animation: ripple-33 1.5s var(--e-out);
        }
        .services-list .checkbox__trigger:checked + .checkbox__symbol .icon-checkbox path {
        transition: stroke-dashoffset var(--t-base) var(--e-out);
        stroke-dashoffset: 0px;
        }
        .services-list .checkbox__trigger:focus + .checkbox__symbol {
        box-shadow: 0 0 0 0.25em var(--c-primary-20-percent-opacity);
        }
    
        @-webkit-keyframes ripple-33 {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: scale(20);
        }
        }
    
        @keyframes ripple-33 {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: scale(20);
        }
        }
</style>