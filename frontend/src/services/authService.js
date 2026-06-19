import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

class AuthService {

    async signup(name, email, password) {

        const credential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(
            credential.user,
            {
                displayName: name
            }
        );

        return credential.user;
    }

    async login(email, password) {

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return credential.user;
    }

    async loginWithGoogle() {

        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: "select_account"
        });

        const credential =
            await signInWithPopup(
                auth,
                provider
            );

        return credential.user;

    }

    async logout() {

        return signOut(auth);

    }

    async token() {

        if (!auth.currentUser)
            return null;

        return auth.currentUser.getIdToken();

    }

}

export default new AuthService();
