<script>
import { store } from '../store';
import axios from 'axios';

export default {
    data() {
        return {
            store,
            sponsoredApartments: [],
            searchQuery: '',
            latitude : null,
            longitude : null,
        };
    },
    methods: {
        goToSearchPage() {
            const citySearched = document.getElementById('city').value;
            const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(citySearched)}.json?key=9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU`;
            
            axios.get(url)
            .then((response) => {
                this.latitude = response.data.results[0].position.lat;
                this.longitude = response.data.results[0].position.lon;
                this.$router.push({ name: 'search', query: { city: citySearched, latitude:this.latitude, longitude:this.longitude } }); // City is set in the query parameter
            })
        
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
            <h2>Consigliati per te</h2>
            <div class="apartment-list">
                <RouterLink v-for="apartment in sponsoredApartments" :key="apartment.id" class="apartment-item" :to="{name: 'SingleApartment', params: {slug: apartment.slug}}" @click="views(apartment.id)">
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="apartment image">
                    <div class="overlay">
                        <h4>{{ apartment.name }}</h4>
                        <p>{{ apartment.surface }} m2</p>
                        <p>{{ apartment.address }}</p>                        
                    </div>
                </RouterLink>
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

.sponsored-apartments{

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
    transition: .3s ease;

    img{
        height: 100%;
        display: block;
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
</style>