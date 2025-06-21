#include <emscripten.h>
#include <cmath>

struct Vector3 {
  float x, y, z;
};

Vector3 orbPosition = {0, 5, 0};
Vector3 orbVelocity = {0, 0, 0};
const float gravity = -9.8;
const float restitution = 0.8;

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  void updateOrb(float deltaTime) {
    orbVelocity.y += gravity * deltaTime;
    orbPosition.x += orbVelocity.x * deltaTime;
    orbPosition.y += orbVelocity.y * deltaTime;
    orbPosition.z += orbVelocity.z * deltaTime;

    // Room boundaries (cube of size 20)
    if (orbPosition.x > 9.5 || orbPosition.x < -9.5) {
      orbVelocity.x *= -restitution;
      orbPosition.x = orbPosition.x > 9.5 ? 9.5 : -9.5;
    }
    if (orbPosition.y > 9.5 || orbPosition.y < -9.5) {
      orbVelocity.y *= -restitution;
      orbPosition.y = orbPosition.y > 9.5 ? 9.5 : -9.5;
    }
    if (orbPosition.z > 9.5 || orbPosition.z < -9.5) {
      orbVelocity.z *= -restitution;
      orbPosition.z = orbPosition.z > 9.5 ? 9.5 : -9.5;
    }
  }

  EMSCRIPTEN_KEEPALIVE
  float* getOrbPosition() {
    static float pos[3];
    pos[0] = orbPosition.x;
    pos[1] = orbPosition.y;
    pos[2] = orbPosition.z;
    return pos;
  }
}
