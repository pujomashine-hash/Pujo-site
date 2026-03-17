// ====================
// ====== NAVIGATION BAR ======
const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.style.display = "none");
    const targetId = btn.getAttribute("data-target");
    document.getElementById(targetId).style.display = "block";
  });
});

// ====================
// ====== SEARCH BAR ======
const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", () => {
  const searchValue = searchInput.value.toLowerCase();
  document.querySelectorAll(".nyimbo").forEach(song => {
    const title = song.querySelector(".title").textContent.toLowerCase();
    if (title.includes(searchValue)) {
      song.style.display = "";
    } else {
      song.style.display = "none";
    }
  });
});

// ====================
// ====== SONG BUTTONS / DOM ELEMENTS ======
const songList = document.getElementById("song-list");

fetch("PUJO HYMNS.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(song => {
      const btn = document.createElement("button");
      btn.className = "nyimbo";
      btn.dataset.file = song.file;
      btn.dataset.lyrics = song.lyrics;

      btn.innerHTML = `
        <div class="names">
          <div class="title">${song.title}</div>
          <div class="artist">${song.artist}</div>
        </div>
        <span class="three-dots">⋮
          <div class="dots-menu">
            <p>Share</p>
            <p>Like 👍</p>
          </div>
        </span>
      `;
      songList.appendChild(btn);
    });

    // Event delegation kwa dynamic buttons
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const back = document.getElementById("back");

    songList.addEventListener("click", e => {
      const btn = e.target.closest(".nyimbo");
      if (!btn) return;

      const lyricsFile = btn.dataset.lyrics;
      const fileKey = btn.dataset.file;

      // fetch lyrics
      fetch(lyricsFile)
        .then(res => res.text())
        .then(data => {
          lyrics.innerHTML = data.replace(/\n/g, "<br>");
        });

      // set audio source
      fetch("PUJO HYMNS.json")
        .then(res => res.json())
        .then(data => {
          audio.src = btn.dataset.file;
        });

      songList.style.display = "none";
      songDetails.style.display = "block";
    });

    // BACK / PLAY / PAUSE
    back.addEventListener("click", () => {
      songList.style.display = "block";
      songDetails.style.display = "none";
      audio.pause();
    });
    play.addEventListener("click", () => audio.play());
    pause.addEventListener("click", () => audio.pause());
  });