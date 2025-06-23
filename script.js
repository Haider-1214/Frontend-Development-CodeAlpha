// Professional Music Player JavaScript Implementation

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const songTitleEl = document.getElementById('song-title');
const songArtistEl = document.getElementById('song-artist');
const playlistList = document.getElementById('playlist-list');

let isPlaying = false;
let currentTrackIndex = 0;

// Sample playlist data for demo (dummy realistic data)
const playlist = [
  {
    title: "Electro Dreams",
    artist: "Synthwave Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Chill Vibes",
    artist: "Lo-Fi Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Upbeat Energy",
    artist: "Indie Pop",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

// Load track into audio element and update UI
function loadTrack(index) {
  const track = playlist[index];
  if (!track) return;

  audio.src = track.src;
  songTitleEl.textContent = track.title;
  songArtistEl.textContent = track.artist;
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  updateActivePlaylistItem(index);
}

// Play or pause toggle
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

// Play event handler
audio.addEventListener('play', () => {
  isPlaying = true;
  playPauseBtn.textContent = 'pause';
  playPauseBtn.setAttribute('aria-label', 'Pause');
  playPauseBtn.setAttribute('aria-pressed', 'true');
});

// Pause event handler
audio.addEventListener('pause', () => {
  isPlaying = false;
  playPauseBtn.textContent = 'play_arrow';
  playPauseBtn.setAttribute('aria-label', 'Play');
  playPauseBtn.setAttribute('aria-pressed', 'false');
});

// Update progress bar and current time as audio plays
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Update duration label when metadata loaded
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

// Format seconds to m:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' + s : s);
}

// Seek audio position by progress bar input
progressBar.addEventListener('input', () => {
  if (!audio.duration) return;
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Play previous track
function playPrev() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;
  loadTrack(currentTrackIndex);
  audio.play();
}

// Play next track
function playNext() {
  currentTrackIndex++;
  if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
  loadTrack(currentTrackIndex);
  audio.play();
}

// Mute/unmute toggle
function toggleMute() {
  audio.muted = !audio.muted;
  if (audio.muted) {
    muteBtn.textContent = 'volume_off';
    muteBtn.setAttribute('aria-label', 'Unmute volume');
    muteBtn.setAttribute('aria-pressed', 'true');
  } else {
    muteBtn.textContent = 'volume_up';
    muteBtn.setAttribute('aria-label', 'Mute volume');
    muteBtn.setAttribute('aria-pressed', 'false');
  }
}

// Volume slider control
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  if (audio.volume === 0) {
    audio.muted = true;
    muteBtn.textContent = 'volume_off';
    muteBtn.setAttribute('aria-label', 'Unmute volume');
    muteBtn.setAttribute('aria-pressed', 'true');
  } else {
    audio.muted = false;
    muteBtn.textContent = 'volume_up';
    muteBtn.setAttribute('aria-label', 'Mute volume');
    muteBtn.setAttribute('aria-pressed', 'false');
  }
});

// Update active playlist item styling
function updateActivePlaylistItem(index) {
  const items = playlistList.querySelectorAll('.playlist-item');
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'true');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });
}

// Build playlist UI
function buildPlaylist() {
  playlistList.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.classList.add('playlist-item');
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.textContent = track.title + " — " + track.artist;

    li.addEventListener('click', () => {
      if (index === currentTrackIndex) {
        togglePlayPause();
      } else {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audio.play();
      }
    });

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });

    playlistList.appendChild(li);
  });
}

// Auto play next track on current track end
audio.addEventListener('ended', () => {
  playNext();
});

// Button event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
muteBtn.addEventListener('click', toggleMute);

// Keyboard shortcuts for play/pause space, next n, prev p
window.addEventListener('keydown', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') return; // ignore inputs

  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'n':
      playNext();
      break;
    case 'p':
      playPrev();
      break;
  }
});

// Initialize player on page load
function initPlayer() {
  buildPlaylist();
  loadTrack(currentTrackIndex);
  audio.volume = volumeSlider.value;
}

initPlayer();

