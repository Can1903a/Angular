import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user/profile/profile.component';
import { MatCellDef, MatColumnDef, MatTableModule } from '@angular/material/table'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports: [MatTableModule,MatColumnDef,MatCellDef],
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
