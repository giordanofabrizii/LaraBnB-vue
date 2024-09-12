<script>
export default{
    data() {
        return{
            headerLinks : [
                {
                    'name': 'home',
                    'label': 'Home'
                },
                {
                    'name': 'search',
                    'label': 'Search'
                },
            ],
        }
    }
}
</script>

<template>
    <div>
        <ul>
            <li v-for="(link, index) in headerLinks" :key="index">
                <router-link :to="{ name:link.name }">
                    {{ link.label }}
                </router-link>
            </li>
        </ul>
        <a href="http://127.0.0.1:8000/">Login</a>
    </div>
</template>

<style scoped>
div{
    display: flex;
    justify-content: center;
    align-items: center;
}
ul{
    display: flex;
    justify-content: center;
    list-style: none;
}
li{
    padding-right: 2rem;
}
a{
    color: black;
}
</style>