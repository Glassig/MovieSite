import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { User } from '../model/user';
@Injectable()
export class AF {


  isLoggedIn: boolean = false;
  public user: User;

  constructor(public af: AngularFire) {
    this.user = new User();
  }
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */

  login(provider: AuthProviders) {
    return this.af.auth.login({
      provider: provider,
      method: AuthMethods.Popup,
    })
    .then((data) => {
      this.user = this.userFromJson(data);
      this.isLoggedIn = true;
    });
  }

  userFromJson(json: any): User {
    var user = new User();
    user.email = json.auth.email;
    user.id = +json.uid;
    user.imageUrl = json.auth.photoURL;
    user.name = json.auth.displayName;
    return user;
  }
  /**
   * Logs out the current user
   */
  logout() {
    this.isLoggedIn = false;
    this.user = new User();
    return this.af.auth.logout();
  }
}