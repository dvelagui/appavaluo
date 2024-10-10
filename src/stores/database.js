import { defineStore } from "pinia";
import {
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "src/boot/firebase"; // Firestore configuration

export const useDatabaseStore = defineStore("database", {
  state: () => ({
    userData: null, // Store the user's data
  }),
  actions: {
    // Save user data to Firestore
    async saveUserData(uid, { name, email, role, photo, admin, adminEmail }) {
      try {
        await setDoc(doc(db, "users", uid), {
          uid,
          admin: admin ? admin : "Wg4R2D1YkIaGSf2nCWHRQsfreIy1",
          adminEmail: admin ? adminEmail : "programacion@avaluoenlinea.com",
          name,
          email,
          role,
          date: new Date().getTime(), // Automatically sets the current timestamp
          photo,
          phone: "000-000-0000",
        });
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
    async UpdateUserData(field, val, uid, userdata) {
      this.loadingUser = true;
      const keyUpdate = Object.keys(userdata).find(
        (key) => userdata[key] == field
      );
      try {
        const docRef = doc(db, "users", uid);
        const currentUser = doc(db, "users", this.userData.uid);
        if (keyUpdate === "adminEmail") {
          console.log("si es el admin", keyUpdate, val);
          const querySnapshot = await getDocs(
            query(
              collection(db, "users"),
              // where("role", "==", "inspector"),
              where("email", "==", val)
            )
          );
          querySnapshot.forEach(async (doc) => {
            await updateDoc(docRef, {
              admin: doc.data().uid,
              [keyUpdate]: val,
            });
          });
          onSnapshot(currentUser, (userDocu) => {
            this.userData = userDocu.data();
          });
        } else {
          await updateDoc(docRef, {
            [keyUpdate]: val,
          });
          onSnapshot(currentUser, (userDoc) => {
            this.userData = userDoc.data();
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },
    async fetchInspectors() {
      const inspectors = [];
      if (this.userData.role === "admin") {
        const querySnapshot = await getDocs(query(collection(db, "users")));
        querySnapshot.forEach((doc) => {
          inspectors.push({ id: doc.id, ...doc.data() });
        });
      } else {
        const querySnapshot = await getDocs(
          query(
            collection(db, "users"),
            // where("role", "==", "inspector"),
            where("admin", "==", this.userData.uid)
          )
        );
        querySnapshot.forEach((doc) => {
          if (inspectors.every((inspector) => inspector.id !== doc.id)) {
            inspectors.push({ id: doc.id, ...doc.data() });
          }
        });
      }
      const querySnapshot = await getDocs(
        query(
          collection(db, "users"),
          // where("role", "==", "inspector"),
          where("admin", "==", this.userData.uid)
        )
      );
      querySnapshot.forEach((doc) => {
        if (inspectors.every((inspector) => inspector.id !== doc.id)) {
          inspectors.push({ id: doc.id, ...doc.data() });
        }
      });
      return inspectors;
    },
  },
});
