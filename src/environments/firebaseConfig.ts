
import {AuthMethods, AuthProviders} from "angularfire2";


export const firebaseConfig = {
    // Paste all this from the Firebase console...
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***",
    databaseURL: "***REMOVED***",
    storageBucket: "***REMOVED***",
    messagingSenderId: "***REMOVED***"
};

export const authConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
};
