import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails } from 'src/app/types/userDetails';
import { UserService } from 'src/app/user/user.service';
import { ApiService } from '../api.service';
import { Auto } from 'src/app/types/Auto';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  userDetails: UserDetails | undefined;
  isLoading:boolean = true
  autos: Auto[] = []
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserDetails();

  }

  getUserDetails() {
    const ownerId = this.activatedRoute.snapshot.params['id'];

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        users = Object.values(users);
        for (const user of users) {
          if (user.localId == ownerId) {
            this.userDetails = user;
            this.findUserAutos(ownerId)
          }
        }
      },
    });
  }

  findUserAutos(id:string){
    this.isLoading = true
    this.apiService.getAllAutos().subscribe({
      next: (autos) => {
        const autoV =  Object.values(autos)
        const idsV = Object.keys(autos)
        autos = this.apiService.getArrayValues(autoV, idsV)
        for (const auto of autos) {
          if(auto.userId == id){
            this.autos?.push(auto)
          }
        }
        this.isLoading = false
      }
    })
  }

  redirectToDetails(id:string):void{
    this.router.navigate([`/autos/${id}`])
  }
}
