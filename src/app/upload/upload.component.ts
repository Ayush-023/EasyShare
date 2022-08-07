import { Component, OnInit } from '@angular/core';
import { Peer } from 'peerjs';
import { IdServiceService } from '../id-service.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  peer: any;
  id: any;
  url: any;
  isUploaded: boolean = false;
  isProcessed: boolean = false;
  fileData: any = {};

  constructor(private idService: IdServiceService) {}

  ngOnInit(): void {
    this.id = this.idService.getID();
    this.peer = new Peer(this.id, {
      host: 'localhost',
      port: 9000,
      path: '/myapp',
    });
    console.log('My peer ID is: ' + this.id);
    // this.peer.on('open', (id: any) => {
    //   console.log('My peer ID is: ' + id);
    //   this.id = id;
    // });
  }

  humanFileSize(bytes: number, si = true, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + ' ' + units[u];
  }

  createLink() {
    this.url = window.location.origin + '/download/' + this.id;
    console.log(this.url);
  }

  fileProcessed(filename: any, filesize: any) {
    this.isProcessed = true;
    this.createLink();
    this.fileData = {
      name: filename,
      size: this.humanFileSize(filesize),
    };
  }

  getFile(event: any, method: boolean) {
    let file: File, blob: Blob;
    if (method) {
      file = event.target.files[0];
      blob = new Blob(event.target.files, { type: file.type });
    } else {
      file = event.addedFiles[0];
      blob = new Blob(event.addedFiles, { type: file.type });
    }
    // console.log(file);
    if (file) {
      this.isUploaded = true;
      let data = {
        file: blob,
        filename: file.name,
        filetype: file.type,
      };
      this.fileProcessed(file.name, file.size);
      this.peer.on('connection', (conn: any) => {
        conn.on('data', (message: any) => {
          console.log(message);
          conn.send(data);
        });
      });
    }
  }
}
