import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
import { StringList } from '../../services/strings';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  public user: SocialUser;
  public loggedIn: boolean;

  constructor(public authService: AuthService, 
    public router: Router,
     public toastr: ToastsManager, 
     vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
   }

  // Logout
  logout(){
    this.authService.signOut();
    this.router.navigate(['login']);

    // Doesn't get displayed
    // this.toastr.success('Logged out', null, {toastLife: 2000});
  }

  ngOnInit() {
    // Checks if user logged in
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if(!this.loggedIn)
        this.router.navigate(['login']);
    });
  }
}
