import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../services/comment.service';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-comment-management',
  standalone: true,
  imports: [    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule],
  templateUrl: './comment-management.component.html',
  styleUrl: './comment-management.component.scss'
})
export class CommentManagementComponent implements OnInit {
  comments: Comment[] = [];

  constructor(
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getAllComments().subscribe(comments => {
      this.comments = comments;
    });
  }

  approveComment(commentId: string): void {
    this.commentService.approveComment(commentId).subscribe(updatedComment => {
      this.comments = this.comments.map(comment =>
        comment._id === commentId ? updatedComment : comment
      );
      this.snackBar.open('Comment approved', 'Close', { duration: 3000 });
    });
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment._id !== commentId);
      this.snackBar.open('Comment deleted', 'Close', { duration: 3000 });
    });
  }
}
