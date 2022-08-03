import { Component, OnInit } from '@angular/core';
import {Peer} from "peerjs"

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getFile(event:any) {
    const file = event.target.files[0]
    if (file) {
      const blob = new Blob(event.target.files, { type: file.type })
      const peer = new Peer("uploader", { host: 'localhost', port: 9000, path: '/myapp' });

      const conn = peer.connect("downloader");
      conn.on("open", () => {
        conn.send({
          file: blob,
          filename: file.name,
          filetype: file.type
        })
      });
    }
  }

}
