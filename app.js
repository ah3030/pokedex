const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const pokemonList = document.getElementById('pokemonList');
        const pokemonContainer = document.getElementById('pokemonContainer');

        const pokemonsGlobal = [];
        let selectedPokemonIndex = null;
        let originalPokemons = [];

        async function getPokemons() {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151');
                const data = await response.json();
                const pokemons = data.results;

                for (const pokemon of pokemons) {
                    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                    const pokemonData = await pokemonResponse.json();
                    normalizePokemons(pokemonData);
                }

                originalPokemons = [...pokemonsGlobal];
                renderPokemonCard(pokemonsGlobal);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const normalizePokemons = (pokemonData) => {
            const img = pokemonData.sprites.other['official-artwork'].front_default;
            const types = pokemonData.types.map(type => type.type.name).join(', ');

            const pokemonObject = {
                name: pokemonData.name,
                img: img,
                types: types,
                abilities: pokemonData.abilities.map(ability => ability.ability.name).join(', '),
                stats: pokemonData.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', '),
                moves: pokemonData.moves.map(move => move.move.name).slice(0, 5).join(', ')
            };
            pokemonsGlobal.push(pokemonObject);
        }

        const renderPokemonCard = (array) => {
            pokemonContainer.innerHTML = '';
            for (let i = 0; i < array.length; i++) {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList = 'pokemon-card';
                pokemonCard.innerHTML = `
                    <h2>${array[i].name}</h2>
                    <img src="${array[i].img}" alt="${array[i].name}" data-index="${i}" />
                    <p><strong>Type:</strong> ${array[i].types}</p>
                `;

                pokemonContainer.appendChild(pokemonCard);
            }
        }

        searchButton.addEventListener('click', async () => {
            const inputValue = searchInput.value.toLowerCase();
            if (inputValue) {
                const index = pokemonsGlobal.findIndex(pokemon => pokemon.name === inputValue);
                if (index !== -1) {
                    selectedPokemonIndex = index;
                    displayPokemonDetails(pokemonsGlobal[index]);
                }
            }
        });

        pokemonContainer.addEventListener('click', (event) => {
            const imgElement = event.target;
            if (imgElement.tagName === 'IMG') {
                const index = imgElement.getAttribute('data-index');
                if (index !== null) {
                    selectedPokemonIndex = index;
                    displayPokemonDetails(pokemonsGlobal[index]);
                }
            }
        });

        function displayPokemonDetails(pokemon) {
            pokemonContainer.innerHTML = `
                <div class="pokemon-details">
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.img}" alt="${pokemon.name}" />
                    <p><strong>Abilities:</strong> ${pokemon.abilities}</p>
                    <p><strong>Stats:</strong> ${pokemon.stats}</p>
                    <p><strong>Type:</strong> ${pokemon.types}</p>
                    <p><strong>Moves:</strong> ${pokemon.moves}</p>
                    <button id="backButton">Regresar</button>
                </div>
            `;

            const backButton = document.getElementById('backButton');
            backButton.addEventListener('click', () => {
                renderPokemonCard(originalPokemons);
                selectedPokemonIndex = null;
            });
        }

        getPokemons();