<script>
import ApartmentShow from "../components/ApartmentShow.vue";
import axios from 'axios';

export default{
    data() {
        return{
            apartments: null,
        }
    },
    components:{
        ApartmentShow
    },
    methods:{
        getApartment(id){
            axios.get(`http://127.0.0.1:8000/api/apartments/${id}`,{
                params: {

                }
            })
            .then((response)=> {
                this.apartments = response.data.results;
                console.log(response.data.results)
            })
            .catch(function (error){
                console.log(error);
            })
        }
    },
    created(){
        this.getApartment(this.$route.params.id);
    }
}
</script>

<template>
    <ApartmentShow v-if="apartments != null" :apartment="apartments"/>
</template>

<style scoped>

</style>