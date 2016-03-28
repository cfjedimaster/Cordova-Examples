var dataTypeMapping = {};

class DataTypeSchema {
  constructor(properties) {
    this.data = {};
    this.setProperties(properties);
  }

  setProperties(properties) {
    if (properties instanceof Object) {
      for (var x in properties) {
        this.data[x] = properties[x];
      }
    }
  }

  toJSON() {
    var data = this.data;
    return {
      '__Ionic_DataTypeSchema': data.name,
      'value': data.value
    };
  }

  isValid() {
    if (this.data.name && this.data.value) {
      return true;
    }
    return false;
  }
}

export class DataType {
  static get(name, value) {
    if (dataTypeMapping[name]) {
      return new dataTypeMapping[name](value);
    }
    return false;
  }

  static getMapping() {
    return dataTypeMapping;
  }

  static get Schema() {
    return DataTypeSchema;
  }

  static register(name, cls) {
    dataTypeMapping[name] = cls;
  }
}

export class UniqueArray {

  constructor(value) {
    this.data = [];
    if (value instanceof Array) {
      for (var x in value) {
        this.push(value[x]);
      }
    }
  }

  toJSON() {
    var data = this.data;
    var schema = new DataTypeSchema({ 'name': 'UniqueArray', 'value': data });
    return schema.toJSON();
  }

  static fromStorage(value) {
    return new UniqueArray(value);
  }

  push(value) {
    if (this.data.indexOf(value) === -1) {
      this.data.push(value);
    }
  }

  pull(value) {
    var index = this.data.indexOf(value);
    this.data.splice(index, 1);
  }
}

DataType.register('UniqueArray', UniqueArray);
