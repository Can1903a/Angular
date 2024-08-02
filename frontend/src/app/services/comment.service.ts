import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl: string;
  private commentUrl: string;
  private commentsUrl: string;

  constructor(private http: HttpClient,private envService: EnvironmentService,private authService:AuthService) {
    this.apiUrl = this.envService.getApiUrl();
    this.commentUrl = this.envService.getComment();
    this.commentsUrl= this.envService.getComments();

   }

   addComment(productId: string, comment: Partial<Comment>): Observable<Comment> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.post<Comment>(`${this.apiUrl}/product/${productId}/addComment`, comment, { headers });
  }

  getCommentsByProductId(productId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/product/${productId}/comments`);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsUrl}`);
  }

  approveComment(commentId: string): Observable<Comment> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.put<Comment>(`${this.commentUrl}/${commentId}/approve`,{}, { headers });
  }

  deleteComment(commentId: string): Observable<void> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.delete<void>(`${this.commentUrl}/${commentId}/delete`, { headers });
  }
}
export interface Comment {
  _id: string;
  musteri_Id: string;
  yorum: string;
  puan: number;
  urun_Id: string;
  yorum_Onay: boolean;
}
