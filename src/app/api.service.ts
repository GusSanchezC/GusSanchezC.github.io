import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://localhost:3000/api/v1/feature';
  private apiUrl = 'https://backend-features-63bad564e0c5.herokuapp.com/api/v1/feature' // API Heroku
  constructor(private http: HttpClient) { }
  // GET Features
  getFeatures(params?: any): Observable<any> {
    let queryParams = new HttpParams();
    if (params) {
      // Agregar parámetros de filtro si se proporcionan
      Object.keys(params).forEach(key => {
        queryParams = queryParams.append(key, params[key]);
      });
    }

    return this.http.get<any>(this.apiUrl, { params: queryParams });
  }
  // GET Comments
  getComments(params: string){
    const commentsUrl = this.apiUrl + "/"+params+"/comments";
    return this.http.get<any>(commentsUrl);
  }
  // POST Comments
  addComment(params: string, commentData: any): Observable<any> {
    const commentsUrl = `${this.apiUrl}/${params}/comments`;
    return this.http.post<any>(commentsUrl, commentData);
  }
}
