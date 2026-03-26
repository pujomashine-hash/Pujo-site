document.addEventListener("DOMContentLoaded", () => {

const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

const songList = document.getElementById("song-list");
const playlistContainer = document.getElementById("playlist-container");
const All = document.getElementById("All");

// ⭐ NEW (FAVOURITES)
const favBtn = document.getElementById("fav");
let currentSong = null;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// ===== INIT: SHOW PLAYLISTS =====
if (playlistContainer) {
  playlistContainer.style.visibility = "visible";
}

// ===== NAVIGATION =====
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.style.display = "none");
    const targetId = btn.getAttribute("data-target");
    document.getElementById(targetId).style.display = "block";
  });
});

// ===== SEARCH =====
const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.toLowerCase();

    document.querySelectorAll(".nyimbo").forEach(btn => {
      const title = btn.querySelector(".title").textContent.toLowerCase();
      const artist = btn.querySelector(".artist").textContent.toLowerCase();

      if (title.includes(searchValue) || artist.includes(searchValue)) {
        btn.style.display = "";
      } else {
        btn.style.display = "none";
      }
    });
  });
}

// ===== LOAD SONGS =====
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

    // ===== PLAYLIST CLICK =====
    document.querySelectorAll(".playlist").forEach(playlist => {

      playlist.addEventListener("click", () => {

        const artist = playlist.querySelector(".playlist-name").textContent.trim().toLowerCase();

        document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
        playlist.classList.add("active");

        document.querySelectorAll(".nyimbo").forEach(btn => {
          const songArtist = btn.querySelector(".artist").textContent.toLowerCase();

          if (songArtist === artist) {
            btn.style.display = "";
          } else {
            btn.style.display = "none";
          }
        });

        if (playlistContainer) {
          playlistContainer.style.visibility = "hidden";
        }

        if (All) {
          All.style.display = "block";
        }

      });

    });

    // ===== ALL BUTTON =====
    if (All) {
      All.addEventListener("click", () => {

        document.querySelectorAll(".nyimbo").forEach(btn => {
          btn.style.display = "";
        });

        document.querySelectorAll(".playlist").forEach(p => {
          p.classList.remove("active");
        });

        if (playlistContainer) {
          playlistContainer.style.visibility = "visible";
        }

        All.style.display = "none";

      });
    }

    // ===== SONG CLICK =====
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
    const play = document.getElementById("play");
    const Playing = document.getElementById("playing");
    const back = document.getElementById("back");

    songList.addEventListener("click", e => {
      const btn = e.target.closest(".nyimbo");
      if (!btn) return;

      currentSong = {
        title: btn.querySelector(".title").textContent,
        artist: btn.querySelector(".artist").textContent,
        file: btn.dataset.file,
        lyrics: btn.dataset.lyrics
      };
      Playing.textContent = currentSong.title + " - " + currentSong.artist;

      fetch(btn.dataset.lyrics)
        .then(res => res.text())
        .then(text => {
          lyrics.innerHTML = text.replace(/\n/g, "<br>");
        });

      audio.src = btn.dataset.file;

      songList.style.display = "none";
      songDetails.style.display = "block";

      updateFavButton();
    });

    // ===== BACK =====
    back.addEventListener("click", () => {
  songList.style.display = "block";
  songDetails.style.display = "none";

  audio.pause();
  playBtn.textContent = "▶";
});

    play.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    play.textContent = "▶";
  } else {
    audio.pause();
    play.textContent = "▶";
  }
});

    // ===== ❤️ FAVOURITE TOGGLE =====
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        if (!currentSong) return;

        const exists = favourites.some(song => song.title === currentSong.title);

        if (exists) {
          favourites = favourites.filter(s => s.title !== currentSong.title);
        } else {
          favourites.push(currentSong);
        }

        localStorage.setItem("favourites", JSON.stringify(favourites));

        updateFavButton();
        renderFavourites();
      });
    }

    // ===== UPDATE BUTTON =====
    function updateFavButton() {
      if (!currentSong) return;

      const exists = favourites.some(song => song.title === currentSong.title);

      favBtn.textContent = exists ? "❤️" : " ♡";
    }

    // ===== RENDER FAVOURITES =====
    const favScreen = document.getElementById("favourite");

    function renderFavourites() {
      if (!favScreen) return;

      favScreen.innerHTML = "";

      if (favourites.length === 0) {
        favScreen.innerHTML = "<p>No favourite songs yet</p>";
        return;
      }

      favourites.forEach(song => {
        const btn = document.createElement("button");
        btn.className = "nyimbo";

        btn.innerHTML = `
          <div class="names">
            <div class="title">${song.title}</div>
            <div class="artist">${song.artist}</div>
          </div>
        `;

        // click kutoka favourite
        btn.addEventListener("click", () => {

          const songDetails = document.getElementById("song-details");
          const lyrics = document.getElementById("lyrics");
          const audio = document.getElementById("audio");

          currentSong = song;

          fetch(song.lyrics)
            .then(res => res.text())
            .then(text => {
              lyrics.innerHTML = text.replace(/\n/g, "<br>");
            });

          audio.src = song.file;

          songList.style.display = "none";
          songDetails.style.display = "block";
          btn.style.display="none";

          updateFavButton();
        });

        favScreen.appendChild(btn);
      });
    }

    // ===== INIT =====
    renderFavourites();

  });

});

// ===== MENU =====
const menubtn = document.getElementById("menu-btn");
const menucontent = document.getElementById("menu");

if (menubtn) {
  menubtn.addEventListener("click", function() {
    menucontent.style.display =
      menucontent.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function(e) {
    if (!menubtn.contains(e.target) && !menucontent.contains(e.target)) {
      menucontent.style.display = "none";
    }
    const progress = document.getElementById("progress");

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  }
});

// Seek when user clicks on progress bar
const progressContainer=document.getElementById("progress-container")
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});
audio.addEventListener("error", () => {
  Playing.textContent = "❌ Audio not available";
});
  });
}