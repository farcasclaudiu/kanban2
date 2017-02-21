
import {AuthMethods, AuthProviders} from "angularfire2";


export const firebaseConfig = {
    //get these from your created firebase project at https://console.firebase.google.com
    // Paste all this from the Firebase console...
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: ""
};

export const authConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
};
