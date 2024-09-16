<script>
export default {
    data() {
        return {
            sponsoredApartments: [],
            searchQuery: '',
        };
    },
    mounted() {
        // Fetch apartments sponsored from Laravel API
        fetch('http://127.0.0.1:8000/api/sponsored-apartments')
        .then(response => response.json())
        .then(data => {

            console.log("Dati ricevuti:", data);
            this.sponsoredApartments = data;
        })
        .catch(error => {
            console.error("Error fetching sponsored apartments:", error);
        });
    },
    // 
    methods: {
    goToSearchPage() {
        this.$router.push({ name: 'search' });
        }
    }
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
                <RouterLink v-for="apartment in sponsoredApartments" :key="apartment.id" class="apartment-item" :to="{name: 'SingleApartment', params: {slug: apartment.slug}}">
                    <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="">
                    <div class="overlay">
                        <h4>{{ apartment.name }}</h4>
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