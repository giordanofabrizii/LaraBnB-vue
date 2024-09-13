<script>
import axios from 'axios'

export default{
    data() {
        return{
            message: {
                email: '',
                text: '',
                name: '',
                apartment_id: '',
            }
        }
    },
    methods: {
        sendMessage: function (){
            this.verifyEmail();
            this.verifyText();

            function validate(){
                const inputs = document.querySelectorAll('.error');
                
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].classList.contains('on')) { // if an input is showed, return false
                        return false;
                    }
                }
                return true; // else return true
            }

            if (validate() == true) {
                this.message.apartment_id = this.apartment.id
            axios.post('http://127.0.0.1:8000/api/message', this.message)
            .then(response => {
                console.log(response.data.success); // Mostra messaggio di successo
            })
            .catch(error => {
                console.error('Errore durante l\'invio del messaggio:', error);
            })
            }

        },
        verifyEmail: function(){
            function testEmail(email){
                // function to control if the email respect the pattern text@text.text
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            let emailValue = document.getElementById('email').value;
            let errorEl = document.querySelector('#email + .error');
            if (!testEmail(emailValue)) {
                errorEl.classList.add('on');
                errorEl.innerText = "Inserisci un email valida"
            } else {
                errorEl.classList.remove('on');
            }
        },
        verifyText: function(){
            let textValue = document.getElementById('text').value;
            let errorEl = document.querySelector('#text + .error');
            if (textValue.trim().length <=0) {
                errorEl.classList.add('on');
                errorEl.innerText = "Scrivi il tuo testo"
            } else {
                errorEl.classList.remove('on');
            }
        }
    },
    mounted(){
        document.getElementById('email').addEventListener('input',this.verifyEmail);
        document.getElementById('text').addEventListener('input',this.verifyText);
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

        <div class="message">
            <h1>Invia un messaggio</h1>
            <input type="text" name="name" id="name" v-model="message.name" placeholder="Inserisci il tuo nome">
            <input type="text" name="email" id="email" v-model="message.email" placeholder="Inserisci la tua mail">
            <div class="error"></div>
            <input type="text" name="text" id="text" v-model="message.text" placeholder="Scrivi qui il tuo messaggio">
            <div class="error"></div>
            <button @click="sendMessage">Invia</button>
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

.error{
    color: red;
    padding: 1rem;
    display: none;
}

.error.on{
    display: block;
}
</style>