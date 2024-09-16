<script>
import { store } from '../store';
import axios from 'axios';

export default {
    data() {
        return {
            store,
            sponsoredApartments: [],
            searchQuery: '',
        };
    },
    methods: {
        getApartment() {
            const citySearched = document.getElementById('city').value;
            console.log(citySearched)
            const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(citySearched)}.json?key=9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU`;

            fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results) {
                    const latitude = data.results[0].position.lat;
                    const longitude = data.results[0].position.lon;

                    let filters = {
                        'latitude': latitude,
                        'longitude': longitude,
                    }

                    axios.get(`http://127.0.0.1:8000/api/apartments`,{
                        params: filters,
                    })
                    .then((response)=> {
                        this.store.apartments = response.data;
                    })
                } 
            })
            .catch(error => {
                console.error('Errore:', error);
            });
        },
        goToSearchPage() {
            this.getApartment();
            this.$router.push({ name: 'search' });
        }
    },  
    mounted() {
        // Fetch apartments sponsored from Laravel API
        fetch('http://127.0.0.1:8000/api/sponsored-apartments')
            .then(response => response.json())
            .then(data => {

                this.sponsoredApartments = data;
            })
            .catch(error => {
                console.error("Error fetching sponsored apartments:", error);
            });
    },
};
</script>

<template>
    <div>
        <!-- Jumbotron Section -->
        <section class="jumbotron">
            <div class="jumbotron-content">
                <h1>Tempo di partire!</h1>
                <p>Trova l'appartamento perfetto per il tuo soggiorno</p>
                <div class="search">
                    <input type="text" name="city" id="city" placeholder="Dove vuoi andare?">
                    <i @click="goToSearchPage" class="fa-solid fa-search"></i>
                </div>
            </div>
        </section>


        <!-- Main Section: Sponsored Apartments -->
        <section class="sponsored-apartments">
            <div class="container">
                <h2>Appartamenti sponsorizzati</h2>
                <div class="apartment-list">
                    <RouterLink v-for="apartment in sponsoredApartments" :key="apartment.id" class="apartment-item" :to="{name: 'SingleApartment', params: {slug: apartment.slug}}">
                        <h3>{{ apartment.name }}</h3>
                        <p>{{ apartment.description }}</p>
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>


<style lang="scss" scoped>
@use '../style/partials/variables' as *;

a{
    text-decoration: none;
    color: black;
}
.jumbotron {
    text-align: center;
    background-color: white;
    
    .jumbotron-content{
        padding: 3rem;

        p{
            margin: .7rem 0 .5rem 0;
        }

        .search{
        padding: .1rem;
        border-radius: 2rem;
        width: 17rem;
        margin: 0 auto;
        display: flex;
        align-items: center;
        border: 1px solid $primary-color;

        input{
            width: 100%;
            font-size: 1.2rem;
            line-height: 1.5rem;
            margin-left: .5rem;
            border: none;

            &:focus{
                outline: none;
                border: none;
            }
        }

        i{
            border-radius: 50%;
            padding: 1rem;
            background-color: $primary-color;
            color: white;
        }
    }
    }
}

.sponsored-apartments .apartment-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.apartment-item {
    border: 1px solid #ccc;
    padding: 1rem;
    width: 30%;
}
</style>