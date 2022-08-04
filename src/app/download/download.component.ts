import { Component, OnInit } from '@angular/core';
import { Peer } from "peerjs"

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  peer:any;
  conn:any;

  constructor() { }

  ngOnInit(): void {
    this.peer = new Peer("", { host: 'localhost', port: 9000, path: '/myapp' });
    this.peer.on('open', function(id:any) {
      console.log('My peer ID is: ' + id);
      });
  }

  downloadFile(data: any) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      let url = window.URL.createObjectURL(new Blob([data["file"]]));
      link.setAttribute('href', url);
      link.setAttribute('download', data["filename"]);
      document.body.appendChild(link);
      link.click();
      link.remove();
  }

  accept() {
    this.conn = this.peer.connect("uploader");
    this.conn.on("open", () => {
      this.conn.send("send file");
      this.conn.on("data", (data:any) => {
        console.log(data);
        this.downloadFile(data);
      });
    });
  }
}
