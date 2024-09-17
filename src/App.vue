<script>
    import AppHeader from './components/AppHeader.vue';
    import { store } from './store.js';

    export default{
        data() {
            return{
                store,
            }
        },
        components:{
            AppHeader
        }
    }
</script>

<template>
    <div class="container" :class="(store.darkMode == true) ? 'dark' : ''">
        <AppHeader/>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<style lang="scss" scoped>
@use './style/partials/variables' as *;

.container.dark{
    @import './style/dark.scss';
}

main{
    background-color: $primary-color;
    height: calc(100vh - 3.45rem);
    overflow: scroll;
}
</style>