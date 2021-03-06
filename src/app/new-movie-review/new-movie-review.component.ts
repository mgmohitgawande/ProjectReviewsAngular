import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CustomApiService } from '../../services/custom-api.service';
import { Movie } from '../../models/movie';
import { MovieReview } from '../../models/movie-review';
import { HttpModule } from '@angular/http';
import { AuthService } from 'angular4-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-movie-review',
  providers: [MovieService, CustomApiService],
  templateUrl: './new-movie-review.component.html',
  styleUrls: ['./new-movie-review.component.css']
})
export class NewMovieReviewComponent implements OnInit {

  // Misc Vars
  errorMessage: string;
  public divShow: boolean = false;
  public searchBool: boolean = false;
  public validMovie: boolean = false;
  public popupShow: boolean = false;
  resultUser: boolean = false;
  public disableComments: boolean = false;

  // Film / Review Vars
  film: Movie;
  filmReviews: MovieReview;
  filmReviewsAll: MovieReview;
  filmReviewBool: boolean = false;
  newFilmReview: MovieReview; 
  //filmReviewsAllNoDuplicates: MovieReview;
  // Movie Vars
  selMovieTitle: string;
  selMovieID: string;
  selMoviePrice: string;
  starCount: number = 4;
  movieName: string;

  public tempMovPoster: string;

  // User Vars
  user: any;
  loggedIn: boolean;


  constructor(
    public _movieService: MovieService, 
    public _customApiService: CustomApiService,
    public authService: AuthService) {
        this.findMovieStart("brooklyn");
     }

     
  // TODO: return DISTINCT by ImdbId
  // Shows list of reviewed movies at the bottom of the Homepage
  showReviewedMovies(){
    let self = this;

    self._customApiService.getReviews('')
    .subscribe(response => this.filmReviewsAll = response, error => this.errorMessage = <any>error);
    
    //let filmReviewsAll = Array.from(new Set(Array(this.filmReviewsAll)));//...this should work

  //var newvar = Array(this.filmReviewsAll).length;
  
  /*
  for (let i = 0; i < Array(this.filmReviewsAll).length; i++) {
      const element1 = Array(this.filmReviewsAll)[i];
      for (let j = 0; j < Array(this.filmReviewsAll).length; j++) {
        const element2 = Array(this.filmReviewsAll)[j];
        if(element1 == element2){
          Array(this.filmReviewsAll).splice(j, j+1);
        }
      }
    }//nested for loops comparing
  */

    //var uniqEs6 = (filmReviewsAll) => filmReviewsAll.filter((elem, pos, arr) => arr.indexOf(elem) == pos);
    //this.filmReviewsAll = Set(data.map(elt => elt.metadata.currency).filter(Boolean));
   //this.filmReviewsAll= Array.from(this.filmReviewsAll) => itemInArray.app)))
   //myTestArray<MovieReview> = Array.from(new Set(this.filmReviewsAll));

    console.log("***** Method finished. movId: " + "ALL");

    this.filmReviewBool = true;
  }

  /*isntDupe(item){
    var count = 0;
    Array(this.filmReviewsAll).forEach(element => {
      if (element == item)
      {
        count++;
      }
    });
    if(count > 1){
      return true;
    }
    else {
      return false; // isnt a dupe      
    }
 }*/


  // Gets review by ImdbID
  callCustomAPI(movId) {
    let self = this;

    self._customApiService.getReviews(movId)
    .subscribe(response => this.filmReviews = response, error => this.errorMessage = <any>error);

    console.log("callCustomAPI() ***** Method finished. movId: " + movId);

    this.filmReviewBool = true;
  }

  

  // Submits new review for selected movie
  submitReview(comment, img) {
    if(comment == "")
      return false;

    //TODO: UserID, ReviewID??, Refresh New Comment
    this.newFilmReview = new MovieReview(this.getRandomInt(1,99999), this.getRandomInt(1,99999), this.film.imdbID, comment, null, this.starCount, img);

    this._customApiService.createReview(this.newFilmReview)
    .subscribe(
      data => { console.log("Review Posted Successfully"); },
      error => { console.log("Review Post Error!"); });

    console.log(comment + " recorded for film: " + this.film.imdbID);

    this.popupShow = false;
    // Enable page scroll again
    document.getElementsByTagName("body")[0].style.overflow = "auto";
    alert("Review submitted!");
  }

  // When movie is clicked on
  movieSelected(title, id, img) {
    if(title == 'DISABLE_COMMENTS')
      this.disableComments = true;
    else
      this.disableComments = false;

    this.tempMovPoster = img;
    this.selMovieTitle = title;
    this.selMovieID = id;
    this.popupShow = true;

    // Disable page scroll
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    console.log("Movie: " + this.selMovieTitle + " - imdbID: " + this.selMovieID);

    this.callCustomAPI(this.selMovieID);
  }

  // Star selector, ran everytime a star is clicked
  starCheck(x): void{
    console.log("Star: " + x);
    this.starCount = x;
  }

  // "X" clicked to close popup
  closePopup() {
    this.popupShow = false;
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  }

  //get a random number for the review placeholder.
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Begin searching for movie (in OMDB, by Name)
  findMovieStart(name) {
    this.movieName = name;
    console.log("Movie searched ==> " + this.movieName);
    let self = this;

    if (this.movieName != ''){
      self._movieService.getMovies(this.movieName).subscribe(response => this.film = response, error => this.errorMessage = <any>error);
      this.searchBool = true;
      this.validMovie = true;
    }
    return false;
  }

  // When page loads
  ngOnInit(): void { 
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null); // Checks if logged in
    });
    this.showReviewedMovies();
  }
}
