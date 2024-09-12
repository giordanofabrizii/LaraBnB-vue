<script>
export default {
    name: "Home", 
    data() {
        return {
            sponsoredApartments: []
        };
    },
    mounted() {
        // Fetch apartments sponsored from Laravel API
        fetch('/api/sponsored-apartments')
            .then(response => response.json())
            .then(data => {
                this.sponsoredApartments = data;
            })
            .catch(error => {
                console.error("Error fetching sponsored apartments:", error);
            });
    }
};
</script>

<template>
    <div>
        <!-- Jumbotron Section -->
        <section class="jumbotron">
            <div class="container">
                <h1>Benvenuto nel nostro sito di appartamenti</h1>
                <p>Trova l'appartamento perfetto per il tuo soggiorno</p>
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
                    <li><a href="#">Chi siamo</a></li>
                    <li><a href="#">Contatti</a></li>
                    <li><a href="#">Privacy Policy</a></li>
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