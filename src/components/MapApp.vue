<script>
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';

export default {
    name: 'App',
    mounted() {
        const map = tt.map({ // inizialize the map
            key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU", // api key
            container: "map",
            center: [0, 0],
            zoom: 2
        });

        const searchOptions = { 
            key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU",
            language: "it-IT",
            limit: 10, // max number of results
        };

        const searchBox = new SearchBox(services, { // inizialize the search box
            searchOptions: searchOptions,
            placeholder: "Cerca una posizione", 
        });

        map.addControl(searchBox, 'top-left'); // add the search box on the map

        const markers = [];

        searchBox.on('tomtom.searchbox.resultsfound', (data) => { // when results are found
            const results = data.data.results.fuzzySearch.results;
            if (results.length > 0) {
                const firstResult = results[0]; // take only the first option
                map.flyTo({
                    center: firstResult.position,
                    zoom: 14,
                });

                markers.forEach(marker => marker.remove()); // remove the old marker

                markers.length = 0;

                const marker = new tt.Marker() // create the marker on the result
                    .setLngLat(firstResult.position)
                    .setPopup(new tt.Popup({ offset: 5 }).setHTML(`
                        <h1>${firstResult.address.municipality || 'Località'}</h1>
                        <p>${firstResult.address.countrySubdivision || ''} ${firstResult.address.countrySecondarySubdivision || ''}</p>
                    `))
                    .addTo(map);

                    markers.push(marker);

                // save the datas
                this.$emit('update-coordinates', {
                    lat: firstResult.position.lat,
                    lng: firstResult.position.lng
                });
            } else {
                console.log("Nessun risultato trovato.");
            }
        });

        searchBox.on('tomtom.searchbox.resultscleared', () => { // when the searchbox is cleared
            this.$emit('update-coordinates', {
                lat: null,
                lng: null
            });
            markers.forEach(marker => marker.remove());
            markers.length = 0;
        });

        searchBox.on('tomtom.searchbox.noresults', function () { // whene no results are found
            console.log("Nessun risultato trovato per questa ricerca.");
        });

        searchBox.on('tomtom.searchbox.error', function (error) { // whene the search results in error
            console.error("Errore durante la ricerca:", error);
        });
    }
};
</script>

<template>
    <div id="map"></div>
</template>

<style scoped lang="scss">

#map{
    width: 70%;
    margin: 2rem auto;
    aspect-ratio: 1 / 1;
}
</style>