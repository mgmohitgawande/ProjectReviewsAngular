import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
import { UserInfoComponent } from '../user-info/user-info.component';
import { RouterLink, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  // Variables
  public user: SocialUser;
  public loggedIn: boolean;

  constructor(
    public authService: AuthService, 
    public router: Router, 
    public toastr: ToastsManager, 
    vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
  }

  // Login / Logout
  loginLogout(){
    if(this.loggedIn) { // If logged in, signOut and go home
      this.authService.signOut();
      this.toastr.info('You have logged out', null, {toastLife: 2000});
      this.router.navigate(['']);
    } 
    else { // If not logged in, go to login page
      this.router.navigate(['login']);
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null); // Checks if logged in

      if(this.loggedIn)
        this.router.navigate(['']);
    });
  }
}
