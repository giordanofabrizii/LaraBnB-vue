<script>
import axios from 'axios'
import tt from '@tomtom-international/web-sdk-maps';

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
                console.log(response.data.success); //Shows success message
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
        },
        initMap() {
            if (this.apartment.latitude && this.apartment.longitude) {
                const map = tt.map({
                    key: '9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU',
                    container: 'map', 
                    center: [this.apartment.longitude, this.apartment.latitude],
                    zoom: 14
                });
                const marker = new tt.Marker()
                    .setLngLat([this.apartment.longitude, this.apartment.latitude])
                    .addTo(map);
            } else {
                console.error('Coordinate non valide per l\'appartamento.');
            }
    }
},
    mounted(){
        this.initMap();
        document.getElementById('email').addEventListener('input',this.verifyEmail);
        document.getElementById('text').addEventListener('input',this.verifyText);
    },

    props:[
        'apartment'
    ]
}

</script>

<template>
    <div class="container">
        <div class="apartment">
            <img :src="'http://127.0.0.1:8000/storage/' + apartment.image " alt="Immagine">
            <h1>{{ apartment.name }}</h1>
            <h3>{{ apartment.description }}</h3>
            <div class="spec">
                <p>Superficie: {{ apartment.surface }} m<sup>2</sup></p>
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
            <div id="map" class="show-map"></div>
        </div>

        <div class="message">
            <section>
                <div class="insert off">
                    <h1>Invia un messaggio</h1>
                    <label for="name">Nome:</label>
                    <input type="text" name="name" id="name" v-model="message.name" placeholder="Inserisci il tuo nome">
                    <label for="name">Email:</label>
                    <input type="text" name="email" id="email" v-model="message.email" placeholder="Inserisci la tua mail">
                    <div class="error"></div>
                    <label for="text">Messaggio:</label>
                    <input type="text" name="text"  id="text" v-model="message.text" placeholder="Scrivi qui il tuo messaggio" rows="3">
                    <div class="error"></div>
                    <button @click="sendMessage">Invia</button>
                </div>
                <div class="success on">
                    <i class="fa-solid fa-check"></i>
                    <h1>Perfetto!</h1>
                    <p>Il tuo messaggio &egrave; stato inviato, riceverai una risposta nella tua casella di posta</p>
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../style/partials/variables' as *;

div.container{
    .apartment{
        max-width: 50rem;
        margin: 0 auto;
        padding: 1rem;
        background-color: white;
        border-radius: 12px;
        width: 100%;
        img{
            border-radius: 6px;
            height: 30rem;
            object-fit: cover;
            object-position: bottom;
            width: 100%;
        }
        h3{
            font-weight: normal;
        }

        div.spec{
            margin-top: 1rem;
    
            ul{
                margin-top: 1rem;
                list-style: none;
                padding: 0;
                display: flex;
                li{
                    margin-right: .5rem;
                }
            }
        }
    }
    div.show-map{
        height: 150px;
        width: 300px;
        
    }
}
.message{
    position: absolute;
    bottom: 0;
    right: 50px;
    padding-left:  1rem;

    section{
        background-color: $primary-color;
        color: white;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 25rem;

        input{
            width: 100%;
            margin: .5rem 0;
            padding: .5rem;
            border: 1px solid white;
            border-radius: 4px;

            &.big{
                height: 6rem;
            }
        }

        .insert.off{
            display: none;
        }

        .success{
            display: none;
            &.on{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
            }

            i{
                background-color: rgb(0, 207, 17);
                padding: 1.3rem;
                border-radius: 50%;
                margin: 1rem 0;
            }

            h1{
                margin-bottom: 1rem;
            }

            p{
                text-align: center;
                max-width: 15rem;
            }

        }   
    }
    .error{
        color: red;
        padding: 1rem;
        display: none;
    }
    
    .error.on{
        display: block;
    }
}


</style>