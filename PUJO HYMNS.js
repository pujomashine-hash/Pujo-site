document.addEventListener("DOMContentLoaded",()=> {
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

// SEARCH BAR 
const searchInput = document.getElementById("search");
if(searchInput) {
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
}

// ====== SONG BUTTONS ======
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

    // SONG CLICK
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
        .then(data => {
          lyrics.innerHTML = data.replace(/\n/g, "<br>");
        });

      audio.src = btn.dataset.file;

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


// ===== MENU (IMEREJESHWA HAPA) =====
const menubtn = document.getElementById("menu-btn");
const menucontent = document.getElementById("menu");

if(menubtn) {
  menubtn.addEventListener("click", function(){
    if(menucontent.style.display === "block") {
      menucontent.style.display = "none";
    } else {
      menucontent.style.display = "block";
    }
  });

  document.addEventListener("click", function(e) {
    if(!menubtn.contains(e.target) && !menucontent.contains(e.target)){
      menucontent.style.display = "none";
    }
  });
}

});