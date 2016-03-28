import { Settings } from "../core/settings";
import { IonicPlatform } from "../core/core";

var settings = new Settings();

export class BucketStorage {
  constructor(name) {
    this.name = name;
    this.baseStorage = IonicPlatform.getStorage();
  }

  get(key) {
    return this.baseStorage.retrieveObject(this.scopedKey(key));
  }

  set(key, value) {
    return this.baseStorage.storeObject(this.scopedKey(key), value);
  }

  scopedKey(key) {
    return this.name + '_' + key + '_' + settings.get('app_id');
  }
}
