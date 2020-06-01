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
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatCardModule } from '@angular/material/card';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    VideoTestComponent,
    VideoResultComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
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
