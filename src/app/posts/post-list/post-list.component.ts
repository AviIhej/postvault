import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    templateUrl: './post-list.component.html',
    selector: 'app-post-list',
    styleUrls: ['post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    
    posts: Post[] = []
    private postsSub: Subscription

    constructor(public postsService: PostsService){}

    ngOnInit(){
       this.postsService.getPosts()
       this.postsSub = this.postsService.getPostupdateListener()
        .subscribe((posts: Post[]) => {
            this.posts = posts
        })
    }
    
    onDelete(postId: string){
        this.postsService.deletePost(postId)
    }

    ngOnDestroy(){
        this.postsSub.unsubscribe()
    }
}