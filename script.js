document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".artist").forEach((artist) => {
    // Ensure the play button is hidden initially
    const playButton = artist.querySelector(".play");
    if (playButton) {
      playButton.style.opacity = "0";
    }

    artist.addEventListener("mouseover", () => {
      if (playButton) {
        playButton.style.opacity = "1";
      }
    });

    artist.addEventListener("mouseout", () => {
      if (playButton) {
        playButton.style.opacity = "0";
      }
    });
  });
});
let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}
const playmusic = (track, pause = false) => {
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "assets/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
async function main() {
  songs = await getsongs();
  playmusic(songs[0], true);

  let songsul = document.getElementsByClassName("music")[0];
  for (const song of songs) {
    songsul.innerHTML =
      songsul.innerHTML +
      `
    <li>
      <img src="assets/Music.svg" alt="" />
      <div class="info">
        <div>${song.replaceAll("%20")}</div>

      </div>
      <div class="playnow">
      <span>Play Now</span>
      <img src="assets/playnow.svg" alt="" />
      </div>
    </li>`;
  }

  // Corrected line
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "assets/pause.svg";
    } else {
      currentsong.pause();
      play.src = "assets/play.svg";
    }
  });

  // Listen for timeupdate event:
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}:${secondsToMinutesSeconds(currentsong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%"; // Corrected "duartion" to "duration"
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentsong.currentTime = currentsong.duration * percent; // Removed extra * 100
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });
  //Add an event to volume
  let rang = document.querySelector(".range");
  rang.getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-200%";
  });
}
main();

// _______________________________________________________________________________________
