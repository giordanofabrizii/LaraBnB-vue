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
                    this.apartments = response.data; // save the datas
                } catch (error) {
                    console.error('ERRORE', error);
                }
            },
        },
    };
</script>

<template>
    <div>
        <h1>Appartamenti</h1>

        <MapApp/>

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
        
        <button @click="cercaAppartamenti">Carica Appartamenti</button>

        <ul>
            <li v-for="apartment in apartments" :key="apartment.id">
                {{ apartment.name }} - {{ apartment.surface }} mq
            </li>
        </ul>
    </div>
</template>

<style scoped>

</style>