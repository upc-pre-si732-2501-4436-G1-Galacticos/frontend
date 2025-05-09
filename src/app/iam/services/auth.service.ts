import { Injectable } from '@angular/core';
// import {environment} from '../../../environments/environment';
import {environment} from '../../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {SignUpRequest} from '../model/sign-up.request';
import {SignUpResponse} from '../model/sign-up.response';
import {SignInRequest} from '../model/sign-in.request';
import {SignInResponse} from '../model/sign-in.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  basePath: string = `${environment.serverBasePath}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.signedIn.next(true);

      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      if (userId) this.signedInUserId.next(+userId);
      if (email) this.signedInEmail.next(email);
    }
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUserMail() {
    return this.signedInEmail.asObservable();
  }

  /**
   * Sign Up
   * @summary
   * This method sends a POST request to the server to sign up the user.
   * @param signUpRequest - Sign Up Request containing the email and password
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed Up as ${response.email} with ID: ${response.id}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error.message}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  /**
   * Sign In
   * @summary
   * This method sends a POST request to the server to sign in the user.
   * @param signInRequest - Sign In Request containing the email and password
   */
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInEmail.next(response.email);
          localStorage.setItem('token', response.token);
          localStorage.setItem('email',     response.email);
          localStorage.setItem('userId',    response.id.toString());
          console.log(`Signed In as ${response.email} with token: ${response.token}`);
          this.router.navigate(['/']).then();
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInEmail.next('');
          localStorage.removeItem('token');
          console.error(`Error while signing in: ${error.message}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Sign Out
   * @summary
   * This method signs out the user by clearing the local storage and redirecting to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInEmail.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/sign-in']).then();
  }
}
