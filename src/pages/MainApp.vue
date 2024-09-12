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
            <div class="container jumbotron-content">
                <h1>LaraBnb</h1>
                <p>Trova l'appartamento perfetto per il tuo soggiorno</p>
                <div class="search-button">
                    <button @click="goToSearchPage">Vai alla pagina di ricerca</button>
                </div>
            </div>
        </section>


        <!-- Main Section: Sponsored Apartments -->
        <section class="sponsored-apartments">
            <div class="container">
                <h2>Appartamenti sponsorizzati</h2>
                <div class="apartment-list">
                    <div v-for="apartment in sponsoredApartments" :key="apartment.id" class="apartment-item">
                        <h3>{{ apartment.name }}</h3>
                        <p>{{ apartment.description }}</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- Footer Section -->
        <footer class="footer">
            <div class="container">
                <ul>
                    <li><a href="#">ESEMPIO</a></li>
                    <li><a href="#">ESEMPIO</a></li>
                    <li><a href="#">ESEMPIO</a></li>
                </ul>
            </div>
        </footer>
    </div>
</template>


<style scoped>
.jumbotron {
    padding: 3rem;
    background-color: #f8f9fa;
    text-align: center;
}

.search-bar {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-bar input {
    padding: 0.5rem;
    font-size: 1rem;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
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

.footer {
    padding: 2rem;
    background-color: #333;
    color: white;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.footer ul {
    list-style: none;
    padding: 0;
}

.footer li {
    display: inline;
    margin: 0 1rem;
}
</style>