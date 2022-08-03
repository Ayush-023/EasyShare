import { Component, OnInit } from '@angular/core';
import { Peer } from "peerjs"

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.accept();
  }

  accept() {
    const peer = new Peer("downloader", { host: 'localhost', port: 9000, path: '/myapp' });
    const conn = peer.connect("uploader");
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        
      });
    });
  }
}
