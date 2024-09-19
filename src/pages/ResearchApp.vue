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
                radius: null,
                price: null,
                services: [],
            },
            // isSearchExectuted: false,

        };
    },
    methods: {
        async cercaAppartamenti() {
                try {
                    this.updateUrlWithFilters();

                    const response = await axios.get('http://127.0.0.1:8000/api/apartments', { // take the apartments
                        params: this.filters,
                    });

                    this.store.apartments = response.data;
                } catch (error) {
                    console.error('ERRORE', error);
                }
            },
        updateUrlWithFilters(){
            const query = Object.assign({}, this.filters);
            this.$router.push({ query });
        },
        updateCoordinates(coordinates) {
            this.filters.latitude = coordinates.lat;
            this.filters.longitude = coordinates.lng;
        },
        
        openDropdown(){
            this.isOpen = true;
        },
        //per chiudere il dropdown quando si clicca fuori dal div
        closeDropdownOnClickOutside(){
            if (!event.target.closest(".dropdown")) {
                this.isOpen = false;
            }
        },
        views: function(id){ // add a views to the apartment
            // console.log("CIAO HO CLICCATO");

            let data = {
                ip: null,
                apartment_id: id,
            }

            axios.get('https://api.ipify.org?format=json')
            .then((response) => {
                data.ip = response.data.ip // take the ip

                // add a view in the db
                axios.post('http://127.0.0.1:8000/api/apartments/view',{
                    apartment_id: data.apartment_id,
                    ip: data.ip,
                })
            })
            .catch ((error) => {
                console.error('Errore nel recupero dell\'IP:', error);
            });
            
        },
    },
    mounted() {
        this.$nextTick(() => {
            const citySearched = this.$route.query.city; // salva la città cercata
            if (citySearched) {
                this.filters.latitude = this.$route.query.latitude; // salva latitudine e longitudine
                this.filters.longitude = this.$route.query.longitude;
            }
            this.cercaAppartamenti(); // carica gli appartamenti con le coordinate

            let position = {
                lat: this.filters.latitude,
                lng: this.filters.longitude,
            };

            if (this.filters.latitude != null) {
                // Aggiungi la mappa
                const map = tt.map({
                    key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU", // chiave API
                    container: "map", // container della mappa
                    center: [this.filters.longitude, this.filters.latitude], // Centra la mappa sui valori passati
                    zoom: 14, // Zoom iniziale
                });

                setTimeout(() => {
                    map.resize(); // Forza il resize della mappa
                    console.log("Mappa caricata correttamente"); // Test
                }, 200);

                // Crea il marker nella posizione specificata
                const marker = new tt.Marker()
                    .setLngLat([position.lng, position.lat]) // Usa lat e long dalla query
                    .setPopup(new tt.Popup({ offset: 5 }).setHTML(`
                        <h1>${citySearched}</h1>
                        <p>Latitudine: ${position.lat}, Longitudine: ${position.lng}</p>
                    `)) // Popup personalizzato
                    .addTo(map);

                // Sposta la mappa sulla posizione con flyTo
                map.flyTo({
                    center: [position.lng, position.lat], // Centra sulla posizione
                    zoom: 14 // Livello di zoom
                });
            }

            // Aggiungi il listener per chiudere il dropdown quando clicchi fuori
            document.addEventListener("click", this.closeDropdownOnClickOutside); 
        });
    },
};
</script>

<template>
    <div id="research-app">
        <div v-if="this.citySearched">
            <h2>{{ this.citySearched }}</h2>
        </div>
        <h1>Appartamenti</h1>

        <section class="first-results">

        </section>

        <div class="dropdown">
            <button class="dropbtn" @click="openDropdown">Personalizza la ricerca!</button>
            <div v-show="isOpen === true" class="dropdown-content">

                <MapApp :latitude="filters.latitude" :longitude="filters.longitude" @update-coordinates="updateCoordinates" />

                <div class="filters">
            

                    <!-- SURFACE SELECTOR -->
                    <input v-model.number="filters.surface_min" @input="updateUrlWithFilters" placeholder="Superficie minima" type="number">
                    <input v-model.number="filters.surface_max" @input="updateUrlWithFilters" placeholder="Superficie massima" type="number">

                    <!-- ROOM MIN VALUE -->
                    <input v-model.number="filters.room_number" @input="updateUrlWithFilters" placeholder="Numero di stanze minime" type="text">

                    <!-- BATH MIN VALUE -->
                    <input v-model.number="filters.bath_number" @input="updateUrlWithFilters" placeholder="Numero di bagni minimi" type="text">

                    <!-- BED MIN VALUE -->
                    <input v-model.number="filters.bed" @input="updateUrlWithFilters" placeholder="Numero minimo di persone ammesse" type="text">

                    <!-- LATITUDE VALUE -->
                    <input id="latitude" v-model.number="filters.latitude" @input="updateUrlWithFilters" placeholder="Latitudine" type="hidden">

                    <!-- LONGITUDE VALUE -->
                    <input id="longitude" v-model.number="filters.longitude" @input="updateUrlWithFilters" placeholder="Longitudine" type="hidden">
                </div>

                <div class="more-filters">
                    <!-- RADIUS -->
                    <div class="search-radius">
                        <p>Raggio di ricerca:</p>
                        <input v-model.number="filters.radius" min="1000" max="20000" @input="updateUrlWithFilters" placeholder="Longitudine" type="range">    
                    </div>                    

                    <!-- SERVICES-->
                    <div class="services">
                        <h2>Servizi</h2>
                        <div class="services-list">
                            <article class="services-item" v-for="service in services" :key="service.name">
                                <input type="checkbox" :value="service.name" v-model="filters.services" @change="updateUrlWithFilters">
                                <label>{{ service.name }}</label>
                            </article>
                        </div>                        
                    </div>
                </div>

                <button id="search-btn" @click="cercaAppartamenti">Carica Appartamenti</button>

            </div>
        </div>

        
        <ul class="apartment-list">
            <RouterLink v-for="apartment in store.apartments" :key="apartment.id"
                :to="{ name: 'SingleApartment', params: { slug: apartment.slug } }" @click="views(apartment.id)">
                <li class="apartment-item" >
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="apartment image">
                    <div class="overlay">
                        <h4>{{ apartment.name }}</h4>
                        <p>{{ apartment.surface }} m2</p>
                        <p>{{ apartment.address }}</p>                        
                    </div>
                </li>
            </RouterLink>
        </ul>
    
        <div class="no-results" v-if="store.apartments.length === 0">
            <h3>Purtroppo non sono presenti appartamenti disponibili</h3>
            <p>Effettua una nuova ricerca</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../style/partials/variables' as *;


a {
    text-decoration: none;
    color: black;
}

#research-app{

    h1{
        color: white;
        text-align: center;
        margin: 1rem;
    }
}

.dropdown {
    position: relative;
    display: inline-block;
    margin: 0 auto 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    button{
        padding: 1rem 2rem 1rem 2rem;
        width: 15rem;
        margin: 2rem;
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
        background-color: #f9f9f9;
        min-width: 160px;
        width: 100%;
        padding: 0 1rem;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;


        .filters{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;

                input{
                padding: .2rem;
                border-radius: 5px;
                margin: 1rem;
                
            }
        }

        .more-filters{
            display: flex;
            flex-direction: column;

            .search-radius{
                margin: 1rem auto;
                align-self: center;

                p{
                    margin-bottom: .3rem;
                }

                input{
                    width: 270px;
                }
            }

            .services{
                align-self: center;
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                margin: 0 2rem;

                h2{
                    margin-left: 3rem;
                    color: rgb(60, 60, 60);
                }

                .services-list{
                    display: flex;
                    flex-wrap: wrap;

                    .services-item{
                        margin: .7rem;

                        input{
                            margin-right: .3rem;
                        }
                    }
                }
            }
        }
    }
}

.apartment-list {
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.apartment-item {
    position: relative;
    border: 1px solid #060342;
    border-radius: 24px;
    margin: 1rem;
    box-shadow: rgba(255, 255, 255, 0.3) 0 5vw 6vw -8vw, rgba(255, 255, 255, 0) 0 4.5vw 5vw -6vw, rgba(50, 50, 80, 0.5) 0px 4vw 8vw -2vw, rgba(0, 0, 0, 0.8) 0px 4vw 5vw -3vw;
    overflow: hidden;
    aspect-ratio: 9/12;
    width: 15rem;
    transition: .3s ease;

    img{
        height: 100%;
        display: block;
        width: 100%;
        object-fit: cover;
    }

    .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #25262681;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

        h4,
        p{
            color: white;
            padding: .3rem .7rem;
            text-align: center;
            text-shadow: 0 0 10px #0d0c0c;
        }
    }

    &:hover{
        transform: scale(1.05);
    }
}

.no-results{
    color: white;
    text-align: center;
    padding-bottom: 3rem;
}

#map{
        margin-top: 1rem;
        height: 150px;
        width: 300px;
        
    }
</style>