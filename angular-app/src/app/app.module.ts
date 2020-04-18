import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoTestComponent } from './video-test/video-test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoResultComponent } from './video-result/video-result.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatVideoModule } from 'mat-video';
import {MatCardModule} from '@angular/material/card';
import { MatCarouselModule } from '@ngmodule/material-carousel';


@NgModule({
  declarations: [
    AppComponent,
    VideoTestComponent,
    VideoResultComponent
  ],
  imports: [
    MatCarouselModule.forRoot(),
    MatCardModule,
    MatVideoModule,
    MatSliderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
