import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel';

@Component({
  selector: 'app-video-result',
  templateUrl: './video-result.component.html',
  styleUrls: ['./video-result.component.css']
})
export class VideoResultComponent {

  public slides = 
  [
      {
        src: "https://d2yoo3qu6vrk5d.cloudfront.net/images/20190122234936/duv4m9awoaalwq9-420x278.jpg"
      },
      {
        src: "https://memesrandom.com/wp-content/uploads/2020/03/image-610.png"
      },
      {
        src: "https://www.hoydiariodelmagdalena.com.co/wp-content/uploads/2019/10/alvaro_uribe_velez_1.jpg"
      }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  uploadFiles() { 
    console.log("Video");
  }

}
