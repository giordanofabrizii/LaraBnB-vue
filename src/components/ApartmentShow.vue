<script>
export default{
    data() {
        return{
            
        }
    },
    props:[
        'apartment'
    ]
}
</script>

<template>
    <div class="apartment">
        <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="Immagine">
        <h1>{{ apartment.name }}</h1>
        <h3>{{ apartment.description }}</h3>
        <div class="spec">
            <p>Superfice: {{ apartment.surface }} m<sup>2</sup></p>
            <p>Stanze: {{ apartment.n_room }}</p>
            <p>Letti: {{ apartment.n_bed }}</p>
            <p>Bagni: {{ apartment.n_bath }}</p>
            <p>Prezzo: {{ apartment.price }} &#8364;</p>
            <ul>
                <li v-for="services in apartment.services">
                    <i :class="services.icon"></i>
                    {{ services.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
div.apartment{
    margin: auto;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

div.spec{
    width: 100%;
}
ul{
    list-style: none;
    padding: 0;
}
</style>