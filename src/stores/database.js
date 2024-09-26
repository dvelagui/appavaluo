import { defineStore } from "pinia";
import {
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "src/boot/firebase"; // Firestore configuration

export const useDatabaseStore = defineStore("database", {
  state: () => ({
    userData: null, // Store the user's data
  }),
  actions: {
    // Save user data to Firestore
    async saveUserData(uid, { name, email, rol, photo }) {
      try {
        await setDoc(doc(db, "users", uid), {
          uid,
          name,
          email,
          rol,
          date: new Date().getTime(), // Automatically sets the current timestamp
          photo,
          phone: "000-000-0000",
        });
        console.log("User data successfully saved!");
      } catch (error) {
        console.error("Error saving user data: ", error);
      }
    },
    async fetchUserData(uid) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid)); // Assume your collection is 'users'
        if (userDoc.exists()) {
          this.userData = userDoc.data(); // Store the user data in the state
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async UpdateUserData(field, val) {
      this.loadingUser = true;
      const keyUpdate = Object.keys(this.userData).find(
        (key) => this.userData[key] === field
      );
      try {
        const docRef = doc(db, "users", this.userData.uid);
        await updateDoc(docRef, {
          [keyUpdate]: val,
        });
        onSnapshot(docRef, (userDoc) => {
          this.userData = userDoc.data();
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
  },
});
