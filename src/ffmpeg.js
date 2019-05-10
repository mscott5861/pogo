const spawn = require('child_process').spawn,
      Buffer = require('buffer').Buffer,
      EventEmitter = require('events').EventEmitter;


class FFMpeg extends EventEmitter {
  constructor() {
    super();
    this._buff = Buffer.from('');
    this._child = null;
    this._options = {
      input: null,
      quality: null,
      rate: null,
      resolution: null
    }
  }

  getOptions() {
    return this._options;
  }

  getFFMpegArgs() {
    return [
      '-rtsp_transport', 'tcp', 
      '-hwaccel', 'auto',
      '-c:v', 'h264_mmal',
      '-i' , this._options.input, 
      '-f', 'image2', 
      '-q', 3,
      '-c:v', 'copy',
      '-probesize', 1000000,
      '-fflags', '+igndts',
      '-r', 30,
      '-update', 1,
      '-'
    ];
  }

  newListener(e) {
    if (e === 'data' && this.listeners(e).length === 0) {
      this.start();
    }
  }

  observer(changes) {
    if (changes.some(function(change) {
      return change.type === 'update';
    })) {
      this.restart();
    }
  }

  removeListener(e) {
    if (e === 'data' && this.listeners(e).length === 0) {
      this.stop();
    }
  }

  restart() {
    if (this._child) {
      this.stop();
      this.start();
    }
  }


  setOptions(optionsObj) {
    this._options = {
      input: optionsObj.input ? optionsObj.input : null,
      quality: optionsObj ? optionsObj.quality : 3,
      rate: optionsObj ? optionsObj.rate : 10,
      resolution: optionsObj ? optionsObj.resolution : null,
    }
  }

  
  start() {
    this._child = spawn('ffmpeg', this.getFFMpegArgs());
    this._child.stdout.on('data', (data) => {
      if (data.length > 1) {
        this._buff = Buffer.concat([this._buff, data]);

        let byte1 = data[data.length - 2].toString(16),
            byte2 = data[data.length - 1].toString(16);

        // JPEG trailer
        if (byte1 === 'ff' && byte2 === 'd9') {
          console.log('BINGO');
          this.emit('data', this._buff);
          this._buff = Buffer.from('');
        }
      }
    });

    this._child.stderr.on('data', (data) => {
      // All of ffmpeg's logging data are output
      // to stderr
      console.log(`stderr: ${data}`);
    });

    this.emit('start');
    this._child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        throw new Error('FFMpeg executable not found. Install and ensure ffmpeg.cmd executes properly before re-attempting.');
      } else {
        throw err;
      }
    });
  }

  stop() {
    this._child.kill();
    delete this._child;
    this.emit('stop');
  }
}

module.exports = FFMpeg;
