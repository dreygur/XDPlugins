module.exports = `
    <div id="pickScreen">
        <h2>Where are we travelling?</h2>

        <p class="mx-0 mt-1 text-md opacity-65">
            Travel to a surprise location, pick a popular destination, or enter a specific location.
        </p>

        <div class="button large mb-3" uxp-variant="cta" @click="pickSurpriseDestination">
            Surprise destination
        </div>

        <div class="mt-3">
            <hr class="mx-0" />
        </div>

        <h2 class="mt-3">Popular destinations</h2>
        <div id="popularDestinations" class="mt-3">
            
        </div>

        <div class="mt-2">
            <hr class="mx-0" />
        </div>

        <h2 class="mt-3">Let's get specific</h2>

        <form class="row break mt-3" method="dialog" @submit="submitLocation">
            <input id="locationInput" placeholder="Enter location" 
                x-model="selectedLocation"
            />

            <div class="button" uxp-variant="action" @click="submitLocation">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
            </div>
        </form>
    </div>
`;