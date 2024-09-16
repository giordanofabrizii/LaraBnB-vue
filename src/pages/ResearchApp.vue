<script>
import axios from 'axios';
import MapApp from '../components/MapApp.vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: "search",
    components: {
        MapApp
    },
    data() {
        return {
            apartments: [],
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
        };
    },
    methods: {
        async cercaAppartamenti() {
                try {
                    this.updateUrlWithFilters();

                    const response = await axios.get('http://127.0.0.1:8000/api/apartments', { // take the apartments
                        params: this.filters,
                    });

                    this.apartments = response.data;
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

            console.log(this.filters)
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

        <MapApp @update-coordinates="updateCoordinates" />

        <div class="dropdown">
            <button class="dropbtn" @click="openDropdown">Personalizza la ricerca!</button>
            <div v-if="isOpen" class="dropdown-content">

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
                <input id="latitude" v-model.number="filters.latitude" @input="updateUrlWithFilters" placeholder="Latitudine" type="text">

                <!-- LONGITUDE VALUE -->
                <input id="longitude" v-model.number="filters.longitude" @input="updateUrlWithFilters" placeholder="Longitudine" type="text">

                <!-- RADIUS -->
                <input v-model.number="filters.radius" min="1000" max="20000" @input="updateUrlWithFilters" placeholder="Longitudine" type="range">

                <!-- SERVICES-->
                <h2>Servizi</h2>
                <div v-for="service in services" :key="service.name">
                    <input type="checkbox" :value="service.name" v-model="filters.services" @change="updateUrlWithFilters">
                    <label>{{ service.name }}</label>
                </div>

                <button @click="cercaAppartamenti">Carica Appartamenti</button>

            </div>
        </div>

        
        <ul>
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

.dropdown {
    position: relative;
    display: inline-block;
    margin: 3rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    .dropbtn{
        padding: 1rem 2rem 1rem 2rem;
        margin-bottom: 2rem;
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
        padding: 2rem;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }
}




</style>