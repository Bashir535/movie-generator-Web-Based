const movieRecommendations = {
  action: [
    { title: "Mad Max: Fury Road", minAge: 16 },
    { title: "Avengers: Endgame", minAge: 13 },
    { title: "Spider-Man: Into the Spider-Verse", minAge: 10 },
    { title: "Mission: Impossible – Fallout", minAge: 14 }
  ],
  comedy: [
    { title: "The Hangover", minAge: 17 },
    { title: "Superbad", minAge: 17 },
    { title: "Paddington 2", minAge: 5 },
    { title: "The Grand Budapest Hotel", minAge: 14 }
  ],
  drama: [
    { title: "The Shawshank Redemption", minAge: 16 },
    { title: "Forrest Gump", minAge: 13 },
    { title: "The Pursuit of Happyness", minAge: 10 },
    { title: "Whiplash", minAge: 16 }
  ],
};


const form = document.getElementById("recoForm");
const ageInput = document.getElementById("age");
const ageBubble = document.getElementById("ageValue");
const genreSelect = document.getElementById("genre");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const surpriseBtn = document.getElementById("surpriseBtn");


const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function positionBubble(input, bubble){
  const val = Number(input.value);
  const min = Number(input.min);
  const max = Number(input.max);
  const percent = (val - min) / (max - min);
  const offset = input.clientWidth * percent;
  bubble.textContent = val;
  bubble.style.left = `${offset}px`;
}


function renderResults(movies, userAge){
  resultsEl.innerHTML = "";
  if (movies.length === 0){
    statusEl.textContent = "No suitable movies match your filters. Try another genre.";
    return;
  }
  statusEl.textContent = `Found ${movies.length} recommendation${movies.length>1?"s":""}.`;

  movies.slice(0, 6).forEach(movie => {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = movie.title;

    const badges = document.createElement("div");
    badges.className = "badges";

    const ageBadge = document.createElement("span");
    ageBadge.className = "badge";
    ageBadge.textContent = `Min Age ${movie.minAge}`;
    if (userAge >= movie.minAge) ageBadge.classList.add("ok");

    const genreBadge = document.createElement("span");
    genreBadge.className = "badge";
    genreBadge.textContent = genreSelect.options[genreSelect.selectedIndex].text;

    badges.append(ageBadge, genreBadge);

    const actionRow = document.createElement("div");
    actionRow.className = "actions";

    const pickBtn = document.createElement("button");
    pickBtn.type = "button";
    pickBtn.className = "btn btn-ghost";
    pickBtn.textContent = "Watch this";
    pickBtn.addEventListener("click", () => {
      statusEl.textContent = `Selected: ${movie.title}`;
    });

    actionRow.appendChild(pickBtn);
    card.append(title, badges, actionRow);
    resultsEl.appendChild(card);
  });
}


function getEligible(age, genre){
  const group = movieRecommendations[genre];
  if (!group) return [];
  return group.filter(m => age >= m.minAge);
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const age = clamp(parseInt(ageInput.value, 10) || 0, 5, 120);
  const genre = genreSelect.value;

  const eligible = getEligible(age, genre).sort((a,b) => a.minAge - b.minAge);
  renderResults(eligible, age);

  if (eligible.length > 0){
    const pick = pickRandom(eligible);
    statusEl.textContent = `Recommendation: ${pick.title}. (More options shown below.)`;
  }
});


surpriseBtn.addEventListener("click", () => {
  const age = clamp(parseInt(ageInput.value, 10) || 0, 5, 120);
  const all = Object.values(movieRecommendations).flat();
  const eligible = all.filter(m => age >= m.minAge).sort((a,b)=>a.minAge-b.minAge);

  renderResults(eligible, age);
  if (eligible.length){
    const pick = pickRandom(eligible);
    statusEl.textContent = `Random pick: ${pick.title}.`;
  }
});


function updateBubble(){ positionBubble(ageInput, ageBubble); }
window.addEventListener("resize", updateBubble);
ageInput.addEventListener("input", updateBubble);
updateBubble();

