Glowing Orb Scene
A 3D interactive scene featuring a glowing orb with realistic physics, a hidden switch, smooth lighting transitions, and mouse-sensitive light particles. Built with HTML, JavaScript (Three.js, Ammo.js), and C++ (WebAssembly).
Setup Instructions

Clone the Repository
git clone <repository-url>
cd <repository-folder>


Install Emscripten for Compiling C++ to WebAssembly

Follow the Emscripten installation guide.
Activate Emscripten:source <path-to-emscripten>/emsdk_env.sh




Compile C++ Code
emcc physics.cpp -o physics.wasm -s EXPORTED_FUNCTIONS="['_updatePhysics']" -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" -s MODULARIZE=1 -s EXPORT_NAME="initPhysics"


Project Structure
├── index.html
├── physics.cpp
├── physics.js
├── physics.wasm
├── assets/
│   └── picture.jpg
├── README.md


Add Picture

Place a picture.jpg file in the assets folder.


Serve the Project

Use a local server (e.g., Python’s HTTP server):python -m http.server 8000


Open http://localhost:8000 in a browser.



Usage

Move the mouse to influence light particles after the switch is activated.
Click near the switch (when visible) to light the room and reveal the picture.
The orb follows realistic physics, bouncing naturally in the room.

Dependencies

Three.js (CDN)
Ammo.js (CDN)
TWEEN.js (CDN)
Emscripten for compiling C++ to WebAssembly

Notes

Ensure the assets/picture.jpg file exists.
The C++ code is minimal but can be extended for more complex physics calculations.
Host on GitHub Pages or a server supporting WebAssembly for public access.

