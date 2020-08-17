"use strict";

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

  pick(normalizedPosition, scene, camera, time) {
    if (this.pickedObject) {
        this.pickedObject.material.color.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
   
    if (intersectedObjects.length && intersectedObjects[0].object.name === "hover") {
        this.pickedObject = intersectedObjects[0].object;
        this.pickedObjectSavedColor = this.pickedObject.material.color.getHex();
        this.pickedObject.material.color.setHex((time * 8) % 2 > 1 ? 0x049c2a : 0x9c9204);
    }
  }
}