<script>
import { store } from '../store.js';

export default{
    data() {
        return{
            store
        }
    }
}
</script>

<template>
    <header>
        <div class="container">
            <router-link :to="{ name: 'home' }">
                <img src="../assets/icons/logo-blu.png" alt="LaraBnb logo">
            </router-link>
<div>
    <a href="http://127.0.0.1:8000">Log In</a>
    <i :class="(store.darkMode == true) ? 'fa-solid fa-moon' : 'fa-solid fa-sun'" @click="(store.darkMode == true) ? store.darkMode = false : store.darkMode = true"></i>
</div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
    header{
        background-color: white;
        .container{
            display: flex;
            max-width: 960px;
            align-items: center;
            justify-content: space-between;
            margin: 0 auto;

            img{
                height: 3rem;
            }

            a{
                color: black;
                text-decoration: none;
            }

            i{
                padding: .5rem .6rem;
                border-radius: 12px;

                &:hover{
                    background-color: rgb(233, 233, 233);
                    cursor: pointer;
                }
            }
        }
    }

    .container.dark {
        header{
            a,
            i{
                color: white;
            }
        }
    }
</style>