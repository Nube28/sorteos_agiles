import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);
  
  private cloudName = environment.cloudinary.cloudName; 
  private uploadPreset = environment.cloudinary.uploadPreset;

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);

    return this.http.post<any>(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, 
      formData
    ).pipe(
      map(response => response.secure_url)
    );
  }
}