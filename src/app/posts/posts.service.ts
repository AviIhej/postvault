import { Injectable } from '@angular/core';
import { Post }  from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
   private posts: Post[] = []
   private postsUpdated = new Subject<Post[]>()

   constructor(private http: HttpClient){

   }

   getPosts(){
       this.http.get<{ message: string, posts: any}>('http://localhost:3000/api/posts')
       .pipe(map((postData) => {
        return postData.posts.map(post => {
            return {
                title: post.title,
                content: post.content,
                id: post._id
            }
        })
       }))
       .subscribe((transformedPosts) => {
        console.log(transformedPosts)
        this.posts = transformedPosts
        this.postsUpdated.next([...this.posts])
       })
   }
   
   getPostupdateListener(){
       return this.postsUpdated.asObservable()
   }

   addPosts(title: string, content: string){
       const post: Post = {
           id: null,
           title: title, 
           content: content
       }
       this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
       .subscribe((postMessageResponse) => {
           console.log(postMessageResponse.message)
           const id = postMessageResponse.postId
           post.id = id
           this.posts.push(post)
           this.postsUpdated.next([...this.posts])
       })
   }

   deletePost(postId: string){
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
    .subscribe((result) => {
        console.log(result)
       const updatedPosts = this.posts.filter(post => {
        return post.id !== postId
    })

       this.posts = updatedPosts
    //    console.log(updatedPosts)
       this.postsUpdated.next([...this.posts])
    })
   }
}