document.addEventListener("DOMContentLoaded", () => {
const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

const songList = document.getElementById("song-list");
const playlistContainer = document.getElementById("playlist-container");
let lastScreen= "song-list";
const All = document.getElementById("All");
if(songList)songList.style.display = "block";
//initial update check
function checkUpdate() {
  const currentVersion = "1.0.0";

  fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
    .then(res => res.json())
    .then(data => {

      if (data.version !== currentVersion) {
        if (confirm("Kuna update mpya. Unataka kupakua?")) {
          window.location.href = data.url;
        }
      } else {
        alert("App yako iko updated tayari ");
      }

    })
    .catch(() => {
    });
}
checkUpdate();
   
const Themechange=document.getElementById("theme")
if(Themechange) {
const Savedtheme=localStorage.getItem("theme")
if(Savedtheme==="light"){
  document.body.classList.add("light-mode")
}
Themechange.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode")

if(document.body.classList.contains("light-mode")){
  localStorage.setItem("theme","light")
}else {
  localStorage.setItem("theme","dark")
}
});
}

// NEW (FAVOURITES)
const favBtn = document.getElementById("fav");
let currentSong = null;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// ===== INIT: SHOW PLAYLISTS =====
if (playlistContainer) {
  playlistContainer.style.visibility = "visible";
}

// NAVIGATION 
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.style.display = "none");
    const targetId = btn.getAttribute("data-target");
    lastScreen= targetId;
    if(targetId==="playlist-category"){
    document.getElementById(targetId).style.display="grid"
    }else {
    document.getElementById(targetId).style.display = "block";
    }
  });
});

// SEARCH 
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

//  LOAD SONGS 
fetch("PUJO HYMNS.json")
  .then(res => res.json())
  .then(data => {
    // ===== PLAYLIST SYSTEM =====
const categoryContainer = document.getElementById("Category-names");
const Songcontainer=document.getElementById("Category-songs")
let playlistButtons = [];

// Tengeneza buttons za playlist (clone)
data.forEach(song => {
  const btn = document.createElement("button");
  btn.dataset.file = song.file;
  btn.dataset.lyrics = song.lyrics;
  btn.dataset.Category = song.Category;
  btn.className="nyimbo"
  btn.innerHTML = `
    <div class="names">
      <div class="title">${song.title}</div>
      <div class="artist">${song.artist}</div>
    </div>
  `;

  btn.style.display = "none"; // hide initially

  playlistButtons.push(btn);
  Songcontainer.appendChild(btn);
});

// CATEGORY CLICK
let categoryView= "names";
document.querySelectorAll(".Category").forEach(Cat => {
  Cat.addEventListener("click", () => {

    const Category = Cat.id;

    // show filtered songs
    playlistButtons.forEach(btn => {
      if (btn.dataset.Category === Category) {
        btn.style.display = "block";
      } else {
        btn.style.display = "none";
      }
    });
  document.getElementById("Catjina").textContent=Cat.textContent;
    Songcontainer.style.display = "block";
    categoryView= "songs";
document.getElementById("Category-names").style.display="none";
  document.getElementById("Catjina-Container").style.display="block";
  });
});

// PLAYLIST BUTTON CLICK (OPEN SONG)
playlistButtons.forEach(btn => {
  btn.addEventListener("click", () => {
  lastScreen="playlist-category";
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
    const Playing = document.getElementById("playing");

    const currentSong = {
      title: btn.querySelector(".title").textContent,
      artist: btn.querySelector(".artist").textContent,
      file: btn.dataset.file,
      lyrics: btn.dataset.lyrics
    };

    Playing.textContent = currentSong.title + " - " + currentSong.artist;

    fetch(currentSong.lyrics)
      .then(res => res.text())
      .then(text => {
        lyrics.innerHTML = text.replace(/\n/g, "<br>");
      });

    audio.src = currentSong.file;
    // switch screen
    Songcontainer.style.display = "none";
    songDetails.style.display = "block";
    categoryContainer.style.display="none";

  });
});

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
            <button class="share"> Share </button>
          </div>
        </span>
      `;

      songList.appendChild(btn);
    });

    //  PLAYLIST CLICK 
    document.querySelectorAll(".playlist").forEach(playlist => {

      playlist.addEventListener("click", () => {

        const artist = playlist.querySelector(".playlist-name").textContent.trim().toLowerCase();

        document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
        playlist.classList.add("active");

        document.querySelectorAll(".nyimbo").forEach(btn => {
          const songArtist = btn.querySelector(".artist").textContent.toLowerCase();
       
    document.getElementById("jina-container").style.display='block';
          if (songArtist === artist) {
            btn.style.display = "";
          } else {
            btn.style.display = "none";
          }
        });
        
 document.getElementById("jina").textContent=artist;
        if (playlistContainer) {
          playlistContainer.style.visibility = "hidden";
        }

        if (All) {
          All.style.display = "block";
        }

      });

    });

    //  ALL BUTTON 
    if (All) {
      All.addEventListener("click", () => {
   document.getElementById("jina-container").style.display="none";     
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

    //  SONG CLICK 
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
    const play = document.getElementById("play");
    const Playing = document.getElementById("playing");
    const back = document.getElementById("back");
    const categories=document.querySelectorAll(".category")
    const favourite=document.getElementById("favourite")
  let scrollPosition = 0;
    songList.addEventListener("click", e => {
      const btn = e.target.closest(".nyimbo");
      if (!btn) return;
      scrollPosition = window.scrollY

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
    play.addEventListener("click",()=>{
      if(audio.paused) {
      audio.play();
      play.textContent="▶";
      }else {
        audio.pause();
        play.textContent=" ⏯ ";
      }
    });
    document.querySelectorAll(".three-dots").forEach(dot => {
      dot.addEventListener("click",(e)=>{
        e.stopPropagation();
      })
    })

    // BACK
    back.addEventListener("click", () => {

  screens.forEach(screen => screen.style.display = "none");

  const last = document.getElementById(lastScreen);
  last.style.display = "block";

  songDetails.style.display = "none";

  //  HAPA NDIO FIX
  if (categoryView === "names") {
    categoryContainer.style.display = "grid";   // categories
    Songcontainer.style.display = "none";
  } else {
    categoryContainer.style.display = "none";
    Songcontainer.style.display = "block";      // songs
  }

  requestAnimationFrame(()=> {
    window.scrollTo(0, scrollPosition);
  });

  audio.pause();
  play.textContent = "▶";
});

    //  ❤️ FAVOURITE TOGGLE
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

    //  UPDATE BUTTON 
    function updateFavButton() {
      if (!currentSong) return;

      const exists = favourites.some(song => song.title === currentSong.title);

      favBtn.textContent = exists ? "❤️" : " ♡";
    }

    //  RENDER FAVOURITES 
    const favScreen = document.getElementById("favourite");

    function renderFavourites() {
      if (!favScreen) return;

      favScreen.innerHTML = "";

      if (favourites.length === 0) {
        favScreen.innerHTML = `
        <h1 class="favmessage"> Your faviurite Songs</h1>
        <p class="favmessage">No favourite songs yet</p>
          `;
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
          favScreen.style.display="none"

          updateFavButton();
        });

        favScreen.appendChild(btn);
      });
    }
    //  INIT 
    renderFavourites();

  });

//  MENU 
const menubtn = document.getElementById("menu-btn");
const menucontent = document.getElementById("menu");

if (menubtn) {
  menubtn.addEventListener("click", function() {
    menucontent.style.display =
      menucontent.style.display === "block" ? "none" : "block";
  });
}

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

//THEME CHANGING
//Seek when user clicks on progress bar
const progressContainer=document.getElementById("progress-container")
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});
audio.addEventListener("error", () => {
  playing.textContent = "❌ Audio not available";
});
  });
  
const sharebtn= document.getElementById("share")
 if(sharebtn) {
sharebtn.addEventListener("click",(e)=>{
  const {share}= await
  import ('@capacitor/share');

async function shareApp() {
  try {
    await Share.share({
      title: 'PUJO HYMNS',
      text: 'Install for free',
      url: 'https://www.mediafire.com/folder/eyz4rcw94hr5l/Updates'
    });
  } catch (e) {
    console.log(e);
  }
}
});
}


setTimeout (()=> {
 const Ad=document.getElementById("ad")
 if(Ad){
 Ad.style.display="none";
 }
},5000);
// HIDE AND SHOW CATEGORIES
const CategoryNames=document.getElementById("Category-names")
const CategorySongs=document.getElementById("Category-songs")
const Jina=document.getElementById("Catjina")
const Exitbtn = document.getElementById("Exit")
   if(Exitbtn){
  Exitbtn.addEventListener("click",()=> {
    categoryView="names";
    CategoryNames.style.display="grid";
    CategorySongs.style.display="none";
  });
   }
const  Cupdate=document.getElementById("Cupdate")
   if(Cupdate){
   Cupdate.addEventListener("click",()=>{
     function checkUpdate() {
  const currentVersion = "1.0.0";

  fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
    .then(res => res.json())
    .then(data => {

      if (data.version !== currentVersion) {
        if (confirm("Kuna update mpya. Unataka kupakua?")) {
          window.location.href = data.url;
        }
      } else {
        alert("App yako iko updated tayari ");
      }

    })
    .catch(() => {
      alert("Unganisha kwenye mtandao");
    });
}
checkUpdate();
   });
   }
});
