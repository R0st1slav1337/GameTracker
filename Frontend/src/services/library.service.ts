import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Library} from '../app/models';


@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

  getLibrary(): Observable<Library[]>{
    return this.http.get<Library[]>(this.baseUrl + '/library/');
  }

  addToLibrary(request:Library): Observable<Library>{
    return this.http.post<Library>(this.baseUrl + '/library/', request)
  }
}
