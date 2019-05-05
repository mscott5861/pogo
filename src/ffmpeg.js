const spawn = require('child_process').spawn,
      Buffer = require('buffer').Buffer;

module.exports = {
  _buff: null,
  _child: null,
  _options: {
    input: null,
    quality: null,
    rate: null,
    resolution: null,
  },
  getOptions: function() {
    return this._options
  },
  setOptions: function(optionsObj) {
    this._options = {
      input: optionsObj.input,
      quality: optionsObj.quality || 3,
      rate: optionsObj.rate || 10,
      resolution: optionsObj.resolution
    }
  },
  start: function() {
    this._child = spawn(FFMpeg.cmd, this._options());
    this._child.stdout.on('data', (data) => {
      if (data.length > 1) {
        this._buff = Buffer.concat([this._buff, data]);

        offset1 = data[data.length - 2].toString(16);
        offset2 = data[data.length - 1].toString(16);

        if (offset1 === 'ff' && offset2 === 'd9') {
          this.emit('data', this._buff);
          this._buff = Buffer.from('');
        }
      }

      this._child.stderr.on('data', (data) => {
        throw new Error(data);
      });

      this.emit('start');
      this._child.on('error', (err) {
        if (err.code === 'ENOENT') {
          throw new Error('FFMpeg executable not found. Install and ensure ffmpeg.cmd executes properly before re-attempting.');
        } else {
          throw err;
        }
    });
  },
  stop: function() {
    this._child.kill();
    delete this._child;
    this.emit('stop');
  }
}


