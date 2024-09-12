<script>
    import axios from 'axios';
    import MapApp from '../components/MapApp.vue';

    export default {
        name: "search",
        components: {
            MapApp
        },
        data(){
            return{
                apartments: [],
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
                },
            };
        },
        methods: {
            async cercaAppartamenti() {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/apartments', { // take the apartments
                        params: this.filters,
                    });

                    console.log(this.filters)

                    this.apartments = response.data; // save the datas
                } catch (error) {
                    console.error('ERRORE', error);
                }
            },
            updateCoordinates(coordinates) {
                this.filters.latitude = coordinates.lat;
                this.filters.longitude = coordinates.lng;
            }
        },
    };
</script>

<template>
    <div>
        <h1>Appartamenti</h1>

        <MapApp @update-coordinates="updateCoordinates" />

        <input v-model="filters.name" placeholder="Inserisci il nome" type="text">

        <!-- SURFACE SELECTOR -->
        <input v-model.number="filters.surface_min" placeholder="Superficie minima" type="number">
        <input v-model.number="filters.surface_max" placeholder="Superficie massima" type="number">

        <!-- ROOM MIN VALUE -->
        <input v-model.number="filters.room_number" placeholder="Numero di stanze minime" type="text">

        <!-- BATH MIN VALUE -->
        <input v-model.number="filters.bath_number" placeholder="Numero di bagni minimi" type="text">

        <!-- BED MIN VALUE -->
        <input v-model.number="filters.bed" placeholder="Numero minimo di persone ammesse" type="text">

        <!-- LATITUDE VALUE -->
        <input id="latitude" v-model.number="filters.latitude" placeholder="Latitudine" type="text">

        <!-- LONGITUDE VALUE -->
        <input id="longitude" v-model.number="filters.longitude" placeholder="Longitudine" type="text">
        
        <!-- RADIUS -->
        <input v-model.number="filters.radius" min="1000" max="20000" placeholder="Longitudine" type="range">
        
        <button @click="cercaAppartamenti">Carica Appartamenti</button>

        <ul>
            <RouterLink v-for="apartment in apartments" :key="apartment.id" :to="{name: 'SingleApartment', params: {slug: apartment.slug}}">
                <li>
                    {{ apartment.name }} - {{ apartment.surface }} mq
                </li>
            </RouterLink>
        </ul>
    </div>
</template>

<style scoped>
a{
    text-decoration: none;
    color: black;
}
</style>