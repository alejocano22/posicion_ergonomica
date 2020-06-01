import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseStorageService } from '../firebase-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-result',
  templateUrl: './video-result.component.html',
  styleUrls: ['./video-result.component.css']
})
export class VideoResultComponent {

  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });
  
  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public status = false;
  data: any = {};
  public porcentaje = 0;
  public finalizado = false;

  public slides = 
  [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private http: HttpClient,private firebaseStorage: FirebaseStorageService, private breakpointObserver: BreakpointObserver) {}

  uploadFiles() { 
    console.log("Video");
  }

  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    this.status = true;
    let archivo = this.datosFormulario.get('archivo');
    this.data.video = URL.createObjectURL(archivo) + "";

    let referencia = this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo);
    let tarea = this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo);

    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      }
    });


    referencia.getDownloadURL().subscribe((URL) => {
      this.URLPublica = URL;
      console.log(this.URLPublica);
      this.http.post('http://190.159.67.58:5000/proccess',
      {
        url: this.URLPublica,
        filename: this.nombreArchivo,
      })
      .subscribe(
        (val:string[]) => {
          val.forEach(image => {
            this.slides.push({
              src: image
            })
          });
          this.status = false;
        },
        response => {
          console.log('POST call in error', response);
        },
        () => {
          console.log('The POST observable is now completed.');
        });
    });
  }

}
