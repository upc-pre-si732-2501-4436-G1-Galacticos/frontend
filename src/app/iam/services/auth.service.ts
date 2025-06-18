import {Injectable} from '@angular/core';
// import {environment} from '../../../environments/environment';
import {environment} from '../../../environments/environment';
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
  private requestTwoFactorModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


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

  get currentRequestTwoFactorModal() {
    return this.requestTwoFactorModal.asObservable();
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
          console.error();
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  signIn(signInRequest: SignInRequest) {
    return this.http.post<{ message: string }>(
      `${this.basePath}/authentication/sign-in`,
      signInRequest,
      this.httpOptions
    ).subscribe({
      next: (_) => {
        alert(`Verification code sent to ${signInRequest.email}`)
        console.log(`Verification code sent to ${signInRequest.email}`);
        this.signedInEmail.next(signInRequest.email);
        this.requestTwoFactorModal.next(true);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('An unexpected error occurred.');
        }
        this.requestTwoFactorModal.next(true);
      }
    });
  }

  private clearStorage() {
    ['token', 'userId', 'email'].forEach(key => localStorage.removeItem(key));
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
    this.clearStorage();
    this.router.navigate(['/sign-in']).then();
  }

  /**
   * Forgot Password
   * @summary
   * Sends an email with a reset password link to the user.
   * @param email - User's email
   */
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.basePath}/authentication/forgot-password`,
      {email},
      this.httpOptions
    );
  }

  /**
   * Reset Password
   * @summary
   * Resets the user's password using a token.
   * @param token - Reset token sent via email
   * @param email - User's email
   * @param password - New password to set
   */
  resetPassword(verificationCode: string, email: string, password: string) {
    return this.http.post<{ message: string }>(
      `${this.basePath}/authentication/reset-password`,
      {verificationCode, email, password},
      this.httpOptions
    );
  }

  twoFactor(email: string, verificationCode: string) {

    return this.http.post<SignInResponse>(
      `${this.basePath}/authentication/sign-in-two-factor`,
      { email, verificationCode },
      this.httpOptions
    ).subscribe({
      next: (response) => {
        this.signedIn.next(true);
        this.signedInUserId.next(response.id);
        this.signedInEmail.next(response.email);
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.email);
        localStorage.setItem('userId', response.id.toString());
        console.log(`2FA success: logged in ${response.email}`);
        this.requestTwoFactorModal.next(false);
        this.router.navigate(['/']).then();
      },
      error: (err) => {
        this.signedIn.next(false);
        this.signedInUserId.next(0);
        this.signedInEmail.next('');
        this.clearStorage();
        if (err.error && err.error.message) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('An unexpected error occurred.');
        }
      }
    });
  }


}
