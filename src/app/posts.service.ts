import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import {catchError, map, tap} from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}
    createAndStorePost(title: string, content: string) {
  
        const postData: Post = {title: title, content: content}
        this.http.post<{name: string}>('https://recipe-backend-df265-default-rtdb.firebaseio.com/posts.json', postData, {
            observe: 'response'
        }).subscribe(responseData => {
            console.log(responseData.status);
         
        
          }, error => {
              this.error.next(error.message);
          });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty')
        return this.http.get<{[key: string]: Post}>("https://recipe-backend-df265-default-rtdb.firebaseio.com/posts.json", {
            headers: new HttpHeaders({"content-type": "application/json"}),
            params: searchParams
        })
        .pipe(map(responseData=> {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if(responseData.hasOwnProperty(key)){
            postsArray.push({...responseData[key], id: key})
          }
        }
    
        return postsArray;
        }),
        catchError(errorRes => {
            //Send to analytics server
            return throwError(errorRes)
        } ) 
        )
      
    }

    deletePost() {
        return this.http.delete('https://recipe-backend-df265-default-rtdb.firebaseio.com/posts.json',
        {
            observe: 'events',
            responseType: 'text'
        })
        .pipe(
            tap(event => {
                console.log(event);
                if(event.type === HttpEventType.Response){
                    console.log(event.body);
                }
            })
        )
    }
}



