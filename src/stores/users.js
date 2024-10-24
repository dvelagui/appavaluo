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
import { useEmailStore } from "./email";
import { useCalendarStore } from "./calendar";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    userData: null,
    isCreatingUser: false,
    originalUser: null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(email, password, router) {
      const databaseStore = useDatabaseStore();
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
        await databaseStore.fetchUserData(this.user.uid);
        // redirect to home
        router.push("/");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async register(
      email,
      password,
      name,
      role,
      router,
      isCreatingUser,
      passwordAdmin
    ) {
      const databaseStore = useDatabaseStore();
      const emailStore = useEmailStore();
      const calendarStore = useCalendarStore();
      this.loading = true;
      this.error = null;
      try {
        this.isCreatingUser = isCreatingUser;

        if (this.isCreatingUser) {
          this.originalUser = {
            uid: auth.currentUser.uid,
            name: databaseStore.userData.name,
            email: auth.currentUser.email,
            password: passwordAdmin,
          };
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const photo =
          "https://firebasestorage.googleapis.com/v0/b/appvaluo-pwa.appspot.com/o/profile%2Fprofile-default.png?alt=media&token=f864cebc-d5a5-406c-9426-390d0a738a2d"; // Placeholder for user photo

        // Save user data to Firestore
        await databaseStore.saveUserData(userCredential.user.uid, {
          name,
          email,
          role,
          photo,
          admin: this.originalUser ? this.originalUser.uid : this.originalUser,
          adminEmail: this.originalUser
            ? this.originalUser.email
            : this.originalUser,
        });
        // Load user data after registration
        if (databaseStore.userData) {
          await signInWithEmailAndPassword(
            auth,
            this.originalUser.email,
            this.originalUser.password
          );
          await emailStore.newUserInspector({
            name,
            email,
            password,
            role,
            admin: this.originalUser.name,
            contact: this.originalUser.email,
          });
          await calendarStore.createDefaultAvailability(
            userCredential.user.uid
          );
          await databaseStore.fetchUserData(this.originalUser.uid);
          this.originalUser = null;
          router.push(router.currentRoute.value.path);
        } else {
          await databaseStore.fetchUserData(userCredential.user.uid);
          router.push("/");
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle(router) {
      const databaseStore = useDatabaseStore();
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
          const role = "user"; // Default rolee for Google users (adjust as needed)
          await databaseStore.saveUserData(this.user.uid, {
            name,
            email,
            role,
            photo,
            admin: false,
          });
          // Load user data from Firestore
          await databaseStore.fetchUserData(this.user.uid);
          // redirect to home
          router.push("/");
        } else {
          // Load user data from Firestore
          await databaseStore.fetchUserData(this.user.uid);
          // redirect to home
          router.push("/");
        }
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
  },
});
