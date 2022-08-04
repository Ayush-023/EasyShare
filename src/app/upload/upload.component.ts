import { Component, OnInit } from '@angular/core';
import {Peer} from "peerjs"

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  peer:any;

  constructor() { }

  ngOnInit(): void {
    //making uploader id as a part of the url (angular routes parameter,.. so on.. last functionality.. then front-end and done.. yay)
    this.peer = new Peer("uploader", { host: 'localhost', port: 9000, path: '/myapp' });
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
      
      this.peer.on("connection", (conn:any) => {
        conn.on("data", (message:any) => {
            console.log(message);
            conn.send(data);
        });
      });
    }
  }

}
