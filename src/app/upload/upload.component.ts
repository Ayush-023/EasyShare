import { Component, OnInit } from '@angular/core';
import {Peer} from "peerjs"

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  peer:any;
  id:any;
  url:any;

  constructor() { }

  ngOnInit(): void {
    this.peer = new Peer("", { host: 'localhost', port: 9000, path: '/myapp' });
    this.peer.on('open', (id:any) => {
      console.log('My peer ID is: ' + id);
      this.id = id;
    });
  }

  createLink() {
    this.url = window.location.origin + '/download/' + this.id;
    console.log(this.url);
  }

  getFile(event:any) {
    const file = event.target.files[0]
    if (file) {
      const blob = new Blob(event.target.files, { type: file.type })
      let data = {
        file: blob,
        filename: file.name,
        filetype: file.type
      }
      this.createLink();
      this.peer.on("connection", (conn:any) => {
        conn.on("data", (message:any) => {
            console.log(message);
            conn.send(data);
        });
      });
    }
  }

}
