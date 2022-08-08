import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Peer } from 'peerjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  peer: any;
  conn: any;
  uploaderID: any;
  fileData: any = {};
  isFileDataSet: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.uploaderID = this.route.snapshot.paramMap.get('id')!;
    this.peer = new Peer();
    // '', { host: '/', port: 9000, path: '/myapp' }
    this.peer.on('open', (id: any) => {
      console.log('My peer ID is: ' + id);
      this.initialCall();
    });
  }

  initialCall() {
    this.conn = this.peer.connect(this.uploaderID);
    this.conn.on('open', () => {
      this.conn.send('send file');
      this.conn.on('data', (data: any) => {
        console.log(data);
        this.setFileData(data['filename'], data['file']['byteLength']);
        this.conn.close();
      });
    });
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

  downloadFile(data: any) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    let url = window.URL.createObjectURL(new Blob([data['file']]));
    link.setAttribute('href', url);
    link.setAttribute('download', data['filename']);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setFileData(name: string, size: number) {
    this.fileData = {
      name: name,
      size: this.humanFileSize(size),
    };
    this.isFileDataSet = true;
  }

  accept() {
    this.conn = this.peer.connect(this.uploaderID);
    this.conn.on('open', () => {
      this.conn.send('send file');
      this.conn.on('data', (data: any) => {
        this.downloadFile(data);
      });
    });
  }
}
