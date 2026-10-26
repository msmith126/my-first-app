import { useState } from "react";
import "./App.css";
import * as d3 from "d3";

const pokemons = [
  { id: 1, name: "Bulbasaur", type: "Grass", hp: 45, attack: 49, cuteness: 8 },
  { id: 4, name: "Charmander", type: "Fire", hp: 39, attack: 52, cuteness: 8 },
  { id: 7, name: "Squirtle", type: "Water", hp: 44, attack: 48, cuteness: 8 },
  {
    id: 25,
    name: "Pikachu",
    type: "Electric",
    hp: 35,
    attack: 55,
    cuteness: 10,
  },
  { id: 6, name: "Charizard", type: "Fire", hp: 78, attack: 84, cuteness: 4 },
  { id: 9, name: "Blastoise", type: "Water", hp: 79, attack: 83, cuteness: 3 },
  { id: 3, name: "Venusaur", type: "Grass", hp: 80, attack: 82, cuteness: 3 },
  {
    id: 150,
    name: "Mewtwo",
    type: "Psychic",
    hp: 106,
    attack: 110,
    cuteness: 2,
  },
  {
    id: 39,
    name: "Jigglypuff",
    type: "Normal",
    hp: 115,
    attack: 45,
    cuteness: 9,
  },
  {
    id: 143,
    name: "Snorlax",
    type: "Normal",
    hp: 160,
    attack: 110,
    cuteness: 7,
  },
  { id: 94, name: "Gengar", type: "Ghost", hp: 60, attack: 65, cuteness: 5 },
  { id: 131, name: "Lapras", type: "Water", hp: 130, attack: 85, cuteness: 7 },
  { id: 133, name: "Eevee", type: "Normal", hp: 55, attack: 55, cuteness: 10 },
  {
    id: 149,
    name: "Dragonite",
    type: "Dragon",
    hp: 91,
    attack: 134,
    cuteness: 7,
  },
  { id: 59, name: "Arcanine", type: "Fire", hp: 90, attack: 110, cuteness: 6 },
  {
    id: 65,
    name: "Alakazam",
    type: "Psychic",
    hp: 55,
    attack: 50,
    cuteness: 2,
  },
  {
    id: 68,
    name: "Machamp",
    type: "Fighting",
    hp: 90,
    attack: 130,
    cuteness: 1,
  },
  { id: 76, name: "Golem", type: "Rock", hp: 80, attack: 120, cuteness: 1 },
  {
    id: 130,
    name: "Gyarados",
    type: "Water",
    hp: 95,
    attack: 125,
    cuteness: 2,
  },
  {
    id: 148,
    name: "Dragonair",
    type: "Dragon",
    hp: 61,
    attack: 84,
    cuteness: 6,
  },
];

// Sprite image URL pattern:
// `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
const typeColors = {
  Grass: "#78c850",
  Fire: "#f08030",
  Water: "#6890f0",
  Electric: "#f8d030",
  Psychic: "#f85888",
  Normal: "#a8a878",
  Ghost: "#705898",
  Dragon: "#7038f8",
  Fighting: "#c03028",
  Rock: "#b8a038",
};

function PokemonCard({ pokemon }) {
  return (
    <div
      style={{
        border: "2px solid gold",
        borderRadius: 8,
        padding: 8,
        background: typeColors[pokemon.type],
      }}
    >
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={pokemon.name}
      />
      <div
        style={{
          background: "white",
          color: "black",
          borderRadius: 4,
          padding: 4,
        }}
      >
        <h3>{pokemon.name}</h3>
        <p>Type: {pokemon.type}</p>
        <p>HP: {pokemon.hp}</p>
        <p>Attack: {pokemon.attack}</p>
        <p>Cuteness: {pokemon.cuteness}/10</p>
      </div>
    </div>
  );
}

const types = Object.keys(typeColors);
const hpExtent = d3.extent(pokemons, (p) => p.hp);
const attackExtent = d3.extent(pokemons, (p) => p.attack);

function RangeFilter({ label, range, setRange, extent }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h4>
        {label}: {range[0]} – {range[1]}
      </h4>
      <label style={{ display: "block" }}>
        Min{" "}
        <input
          type="range"
          min={extent[0]}
          max={extent[1]}
          value={range[0]}
          onChange={(e) =>
            setRange([Math.min(+e.target.value, range[1]), range[1]])
          }
        />
      </label>
      <label style={{ display: "block" }}>
        Max{" "}
        <input
          type="range"
          min={extent[0]}
          max={extent[1]}
          value={range[1]}
          onChange={(e) =>
            setRange([range[0], Math.max(+e.target.value, range[0])])
          }
        />
      </label>
    </div>
  );
}

function App() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [hpRange, setHpRange] = useState(hpExtent);
  const [attackRange, setAttackRange] = useState(attackExtent);
  const [sortBy, setSortBy] = useState("featured");
  const [reversed, setReversed] = useState(false);

  function toggleType(type) {
    setSelectedTypes(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type],
    );
  }

  function clearFilters() {
    setSelectedTypes([]);
    setHpRange(hpExtent);
    setAttackRange(attackExtent);
  }

  const shown = pokemons.filter(
    (p) =>
      (selectedTypes.length === 0 || selectedTypes.includes(p.type)) &&
      p.hp >= hpRange[0] &&
      p.hp <= hpRange[1] &&
      p.attack >= attackRange[0] &&
      p.attack <= attackRange[1],
  );

  const sorted =
    sortBy === "featured"
      ? [...shown]
      : [...shown].sort((a, b) =>
          sortBy === "name"
            ? d3.ascending(a.name, b.name)
            : d3.descending(a[sortBy], b[sortBy]),
        );
  if (reversed) sorted.reverse();

  return (
    <>
      <h1>PokéMart</h1>
      <div style={{ display: "flex", gap: 24, textAlign: "left" }}>
        <aside style={{ width: 200, flexShrink: 0 }}>
          <h3>Filter by</h3>
          <h4>Type</h4>
          <div
            style={{
              maxHeight: 150,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 8,
            }}
          >
            {types.map((type) => (
              <label key={type} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />{" "}
                {type}
              </label>
            ))}
          </div>
          <RangeFilter
            label="HP"
            range={hpRange}
            setRange={setHpRange}
            extent={hpExtent}
          />
          <RangeFilter
            label="Attack"
            range={attackRange}
            setRange={setAttackRange}
            extent={attackExtent}
          />
          <button onClick={clearFilters} style={{ marginTop: 16 }}>
            Clear filters
          </button>
        </aside>
        <main style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>{shown.length} results</p>
            <label>
              Sort by{" "}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="hp">HP</option>
                <option value="attack">Attack</option>
                <option value="cuteness">Cuteness</option>
              </select>{" "}
              <button onClick={() => setReversed(!reversed)}>⇅</button>
            </label>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {sorted.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
