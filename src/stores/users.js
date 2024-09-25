import { defineStore } from "pinia";
import { db, auth, provider } from "src/boot/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDatabaseStore } from "./database";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    userData: null,
    loading: false,
    error: null,
  }),

  actions: {
    async initAuth() {
      const auth = getAuth()
      // Listen for authentication state changes
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // If user is logged in, store the user object in Pinia store
          this.user = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL
          }
        } else {
          // If no user is logged in, reset user state
          this.user = null
        }
      })
    },
    async login(email, password, router) {
      this.loading = true;
      this.error = null;
      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;

        // Load user data from Firestore
        await this.fetchUserData(this.user.uid);

        router.push("/");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password, name, rol, router) {
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;

        const databaseStore = useDatabaseStore();
        const photo =
          "https://firebasestorage.googleapis.com/v0/b/appvaluo-pwa.appspot.com/o/profile%2Fprofile-default.png?alt=media&token=f864cebc-d5a5-406c-9426-390d0a738a2d"; // Placeholder for user photo

        // Save user data to Firestore
        await databaseStore.saveUserData(this.user.uid, {
          name,
          email,
          rol,
          photo,
        });

        // Load user data after registration
        this.userData = { email, name, rol, photo };
        router.push("/");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle(router) {
      this.loading = true;
      this.error = null;
      try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;

        // Extract user data from Google result
        const name = result.user.displayName;
        const email = result.user.email;
        const photo = result.user.photoURL;

        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(db, "users", this.user.uid));

        // If user data doesn't exist, create a new entry in Firestore
        if (!userDoc.exists()) {
          const databaseStore = useDatabaseStore();
          const rol = "user"; // Default role for Google users (adjust as needed)
          await databaseStore.saveUserData(this.user.uid, {
            name,
            email,
            rol,
            photo,
          });
        }

        // Load user data from Firestore
        await this.fetchUserData(this.user.uid);

        router.push("/");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await signOut(auth);
        this.user = null;
        this.userData = null;

        router.push("/inicio-sesion");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserData(uid) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          this.userData = userDoc.data();
        }
      } catch (err) {
        console.error("Error fetching user data: ", err);
      }
    },

  },
});
