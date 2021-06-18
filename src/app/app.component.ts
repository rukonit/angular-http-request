import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './posts.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  errorM = null;
  errorSubscription: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
   this.errorSubscription = this.postService.error.subscribe((errorMessage) => {
      this.errorM = errorMessage;
    });

    this.isFetching = true
  this.postService.fetchPosts().subscribe((posts => {

    this.loadedPosts = posts;
    this.isFetching = false;
    
  }), error => {
    this.errorM = error.message;
  });
  }

  onCreatePost(postData: Post) {
    // Send Http request
   this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true
    // Send Http request\
    setTimeout(()=> {   
      
      this.postService.fetchPosts().subscribe((posts => {
    
        this.loadedPosts = posts;
        this.isFetching = false;
      }), error => {
        this.errorM = error.message;
      });
     }, 2000)
   
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePost().subscribe(()=> {
      this.loadedPosts = [];
    })
  }

ngOnDestroy() {
  this.errorSubscription.unsubscribe();
}

onHandleError() {
   this.errorM = null;
   this.isFetching = false;
}
    
}

