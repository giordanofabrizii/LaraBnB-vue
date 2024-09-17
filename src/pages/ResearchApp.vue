<script>
import axios from 'axios';
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
                name: null,
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
            isOpen: false,
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
                    // this.isSearchExectuted = true;
                } catch (error) {
                    console.error('ERRORE', error);
                    // this.isSearchExectuted = true;
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
        }
    },
    mounted() {
        document.addEventListener("click", this.closeDropdownOnClickOutside);
    },
};
</script>

<template>
    <div id="research-app">
        <h1>Appartamenti</h1>

        <section class="first-results">

        </section>

        <div class="dropdown">
            <button class="dropbtn" @click="openDropdown">Personalizza la ricerca!</button>
            <div v-if="isOpen" class="dropdown-content">

                <MapApp @update-coordinates="updateCoordinates" />

                <div class="filters">
                    <input v-model="filters.name" @input="updateUrlWithFilters" placeholder="Inserisci il nome" type="text">

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

                <!-- RADIUS -->
                <div class="search-radius">
                    <p>Raggio di ricerca:</p>
                    <input v-model.number="filters.radius" min="1000" max="20000" @input="updateUrlWithFilters" placeholder="Longitudine" type="range">    
                </div>                    

                <!-- SERVICES-->
                <div class="services">
                    <h2>Servizi</h2>
                    <div v-for="service in services" :key="service.name">
                        <input type="checkbox" :value="service.name" v-model="filters.services" @change="updateUrlWithFilters">
                        <label>{{ service.name }}</label>
                    </div>
                </div>

                <button id="search-btn" @click="cercaAppartamenti">Carica Appartamenti</button>

            </div>
        </div>


        <section class="apartments">
            <h2>Consigliati per te</h2>
            <div class="apartment-list">
                <RouterLink v-for="apartment in store.apartments" :key="apartment.id" class="apartment-item" :to="{name: 'SingleApartment', params: {slug: apartment.slug}}">
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="apartment image">
                    <div class="overlay">
                        <h4>{{ apartment.name }}</h4>
                    </div>
                </RouterLink>
            </div>
        </section>
        
    
        <div v-if="store.apartments.length === 0">
            <h3>Purtroppo non sono presenti appartamenti disponibili</h3>
            <p>Effettua una nuova ricerca</p>
        </div>

        <div v-if="apartment in apartments" :key="apartment.id" :to="{name:'SingleApartment', params:{slug: partment.slug}}">
            <li>
                {{ apartments.name }} - {{ apartments.surface }} mq
            </li>
        </div>
        <ul v-else>
            <RouterLink v-for="apartment in apartments" :key="apartment.id"
                :to="{ name: 'SingleApartment', params: { slug: apartment.slug } }">
                <li>
                    {{ apartment.name }} - {{ apartment.surface }} mq
                </li>
            </RouterLink>
        </ul>
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
    margin: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    button{
        padding: 1rem 2rem 1rem 2rem;
        width: 15rem;
        margin-bottom: 2rem;
        border: none;
        border-radius: 2rem;
        background-color: #2f408e;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.181);

        &:hover{
            background-color: $primary-color;
            transform: translateY(-2px);
        }
    }

    .dropdown-content {
        background-color: #f9f9f9;
        min-width: 160px;
        width: 100%;
        padding: 2rem;
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

        }

        input{
            padding: .2rem;
            border-radius: 5px;
            margin: 1rem;
            
        }

    }
}


.apartments{

h2{
    text-align: center;
    color: white;
    padding-top: 2rem;
}

.apartment-list {
    padding: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
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

img{
    height: 100%;
    display: block;
}

.overlay {
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color: #252626b1;
overflow: hidden;
width: 100%;
height: 0;
transition: .5s ease;
display: flex;
justify-content: center;
align-items: center;

    h4{
        color: white;
        padding: 1rem;
        text-align: center;
    }
}

&:hover .overlay{
    height: 100%;
}
}



</style>