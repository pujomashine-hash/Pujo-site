document.addEventListener("DOMContentLoaded", () => {

const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

const songList = document.getElementById("song-list");
const playlistContainer = document.getElementById("playlist-container");
const All = document.getElementById("All");

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

// ===== SEARCH (HIDE / SHOW) =====
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
      `;

      songList.appendChild(btn);
    });

    // ===== PLAYLIST CLICK =====
    document.querySelectorAll(".playlist").forEach(playlist => {

      playlist.addEventListener("click", () => {

        const artist = playlist.querySelector(".playlist-name").textContent.trim().toLowerCase();

        // highlight
        document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
        playlist.classList.add("active");

        // filter songs (HIDE / SHOW ONLY)
        document.querySelectorAll(".nyimbo").forEach(btn => {
          const songArtist = btn.querySelector(".artist").textContent.toLowerCase();

          if (songArtist === artist) {
            btn.style.display = "";
          } else {
            btn.style.display = "none";
          }
        });

        // hide playlists (VISIBLE CONTROL)
        if (playlistContainer) {
          playlistContainer.style.visibility = "hidden";
        }

        // show ALL button
        if (All) {
          All.style.display = "block";
        }

      });

    });

    // ===== ALL BUTTON =====
    if (All) {
      All.addEventListener("click", () => {

        // show all songs
        document.querySelectorAll(".nyimbo").forEach(btn => {
          btn.style.display = "";
        });

        // remove highlight
        document.querySelectorAll(".playlist").forEach(p => {
          p.classList.remove("active");
        });

        // show playlists again
        if (playlistContainer) {
          playlistContainer.style.visibility = "visible";
        }

        // hide ALL button
        All.style.display = "none";

      });
    }

    // ===== SONG CLICK =====
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
    const play = document.getElementById("play");
    const pause = document.getElementById("pause");
    const back = document.getElementById("back");

    songList.addEventListener("click", e => {
      const btn = e.target.closest(".nyimbo");
      if (!btn) return;

      fetch(btn.dataset.lyrics)
        .then(res => res.text())
        .then(text => {
          lyrics.innerHTML = text.replace(/\n/g, "<br>");
        });

      audio.src = btn.dataset.file;

      songList.style.display = "none";
      songDetails.style.display = "block";
    });

    // BACK 
    back.addEventListener("click", () => {
      songList.style.display = "block";
      songDetails.style.display = "none";
      audio.pause();
    });

    play.addEventListener("click", () => audio.play());
    pause.addEventListener("click", () => audio.pause());

  });

});

//  MENU (UNCHANGED FROM YOUR OLD CODE)
const menubtn = document.getElementById("menu-btn");
const menucontent = document.getElementById("menu");

if (menubtn) {
  menubtn.addEventListener("click", function() {
    if (menucontent.style.display === "block") {
      menucontent.style.display = "none";
    } else {
      menucontent.style.display = "block";
    }
  });

  document.addEventListener("click", function(e) {
    if (!menubtn.contains(e.target) && !menucontent.contains(e.target)) {
      menucontent.style.display = "none";
    }
  });
}