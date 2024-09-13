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
            }
        },
};
</script>

<template>
    <div>
        <h1>Appartamenti</h1>

        <MapApp @update-coordinates="updateCoordinates" />

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

<style scoped>
a {
    text-decoration: none;
    color: black;
}
</style>