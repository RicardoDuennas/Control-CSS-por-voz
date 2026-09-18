import './style.css';
import * as THREE from 'three';

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const app = document.querySelector('#app');

app.innerHTML = `
  <div class="ui">
    <h1>Control por voz</h1>
    <p>Habla en español y usa estas palabras:</p>
    <div class="commands">
      <span>🏠 <b>Hogar</b> → azul ON</span>
      <span>🚪 <b>Puerta</b> → azul OFF</span>
      <span>🪑 <b>Banca</b> → verde ON</span>
      <span>⌚ <b>Reloj</b> → verde OFF</span>
    </div>
    <button id="listen">🎙️ Iniciar escucha</button>
    <div id="status">Micrófono detenido</div>
    <div class="transcript"><b>Transcripción:</b> <span id="text">—</span></div>
    <div id="error"></div>
  </div>
  <div id="scene"></div>
`;

const sceneHost = document.querySelector('#scene');
const listen = document.querySelector('#listen');
const status = document.querySelector('#status');
const text = document.querySelector('#text');
const error = document.querySelector('#error');

// --- Three.js scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 2.2, 7);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
sceneHost.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambient);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 6),
  new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.8 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.1;
scene.add(floor);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.8, 1.8),
  new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.5 })
);
cube.position.y = 0;
scene.add(cube);

const blueLight = new THREE.PointLight(0x1683ff, 0, 8);
blueLight.position.set(-2.2, 1.6, 1.5);
scene.add(blueLight);

const greenLight = new THREE.PointLight(0x20d060, 0, 8);
greenLight.position.set(2.2, 1.6, 1.5);
scene.add(greenLight);

function setBlue(on) { blueLight.intensity = on ? 12 : 0; }
function setGreen(on) { greenLight.intensity = on ? 12 : 0; }

function resize() {
  const width = sceneHost.clientWidth;
  const height = sceneHost.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.004;
  renderer.render(scene, camera);
}
animate();

// --- Spanish speech recognition ---
function processWords(spokenText) {
  // Lowercase + remove accents so matching is robust.
  const normalized = spokenText
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const words = normalized.match(/[a-zñ]+/g) || [];

  for (const word of words) {
    if (word === 'hogar') setBlue(true);
    if (word === 'puerta') setBlue(false);
    if (word === 'banca') setGreen(true);
    if (word === 'reloj') setGreen(false);
  }
}

if (!Recognition) {
  listen.disabled = true;
  error.textContent = 'Este navegador no soporta reconocimiento de voz. Prueba Chrome.';
} else {
  const recognition = new Recognition();
  let listening = false;

  recognition.lang = 'es-ES';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    listening = true;
    listen.textContent = '⏹️ Detener escucha';
    status.textContent = '🎙️ Escuchando en español...';
    status.classList.add('active');
    error.textContent = '';
  };

  recognition.onresult = (event) => {
    let current = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      current += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        processWords(event.results[i][0].transcript);
      }
    }
    text.textContent = current.trim() || '—';
  };

  recognition.onerror = (event) => {
    if (event.error === 'not-allowed') {
      error.textContent = 'Permite el acceso al micrófono para usar esta aplicación.';
    } else if (event.error !== 'aborted') {
      error.textContent = `Error: ${event.error}`;
    }
  };

  recognition.onend = () => {
    if (listening) {
      try { recognition.start(); } catch (_) {}
    } else {
      status.textContent = 'Micrófono detenido';
      status.classList.remove('active');
    }
  };

  listen.onclick = () => {
    if (listening) {
      listening = false;
      recognition.stop();
    } else {
      try { recognition.start(); } catch (_) {}
    }
  };
}
