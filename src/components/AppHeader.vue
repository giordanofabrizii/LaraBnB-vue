<script>
export default{
    data() {
        return{
            headerLinks : [
                {
                    'name': 'home',
                    'label': 'nome della home'
                },
                {
                    'name': 'bnb',
                    'label': 'nome del link'
                },
            ],
        }
    }
}
</script>

<template>
    <ul>
        <li v-for="(link, index) in headerLinks" :key="index">
            <router-link :to="{ name:link.name }">
                {{ link.label }}
            </router-link>
        </li>
    </ul>
</template>

<style scoped>

</style>