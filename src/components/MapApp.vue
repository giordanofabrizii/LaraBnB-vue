<script>
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';

export default {
    name: 'App',
    mounted() {
        // Inizializza la mappa quando il componente è montato
        const map = tt.map({
            key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU", // Verifica che la tua chiave API sia valida
            container: "map",
            center: [0, 0],
            zoom: 2
        });

        // Opzioni per il SearchBox
        const searchOptions = {
            key: "9ndAiLQMA0GuE3FRyeJN3u42T2H4UMvU",
            language: "it-IT",
            limit: 10, // Limita il numero di risultati per migliorare la leggibilità
        };

        // Inizializza il SearchBox con le opzioni corrette
        const searchBox = new SearchBox(services, {
            searchOptions: searchOptions,
            placeholder: "Cerca una posizione", // Aggiunta di un placeholder per la barra di ricerca
        });

        // Aggiungi il SearchBox come controllo sulla mappa
        map.addControl(searchBox, 'top-left');

        // Debug: Assicurati che il SearchBox sia stato creato correttamente
        console.log("SearchBox aggiunto alla mappa.");

        // Gestisci l'evento quando vengono trovati risultati di ricerca
        searchBox.on('tomtom.searchbox.resultsfound', function (data) {
            const results = data.data.results.fuzzySearch.results;
            if (results.length > 0) {
                // Zoom sulla prima posizione trovata
                const firstResult = results[0];
                map.flyTo({
                    center: firstResult.position,
                    zoom: 14,
                });

                // Creazione marker
                new tt.Marker()
                    .setLngLat(firstResult.position)
                    .setPopup(new tt.Popup({ offset: 5 }).setHTML(`
                        <h1>${firstResult.address.municipality || 'Località'}</h1>
                        <p>${firstResult.address.countrySubdivision || ''} ${firstResult.address.countrySecondarySubdivision || ''}</p>
                    `))
                    .addTo(map);

                // save the datas
                document.getElementById('latitude').value = firstResult.position.lat;
                document.getElementById('longitude').value = firstResult.position.lng;
            } else {
                console.log("Nessun risultato trovato.");
            }
        });

        // Gestisci l'evento per quando la ricerca non produce risultati
        searchBox.on('tomtom.searchbox.noresults', function () {
            console.log("Nessun risultato trovato per questa ricerca.");
        });

        // Gestisci l'evento per errori durante la ricerca
        searchBox.on('tomtom.searchbox.error', function (error) {
            console.error("Errore durante la ricerca:", error);
        });
    }
};
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>


#map{
    height: 50rem;
    margin: 2rem auto;
    aspect-ratio: 1 / 1;
}
</style>