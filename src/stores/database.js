import { defineStore } from "pinia";
import {
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
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
    async addInspectionRequest(request) {
      try {
        const docRef = await addDoc(
          collection(db, "inspection_requests"),
          request
        );
        return docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
      }
    },
    async saveAvailability(availability) {
      try {
        const inspectorId = this.userData.uid;
        const availabilityRef = collection(db, "inspector_availability");

        // Buscar si ya existe disponibilidad para este inspector
        const q = query(
          availabilityRef,
          where("inspectorId", "==", inspectorId)
        );
        const querySnapshot = await getDocs(q);

        let availabilityDoc = null;

        // Si existe, obtenemos el documento
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            availabilityDoc = { id: doc.id, ...doc.data() };
          });
        }

        if (availabilityDoc) {
          // Actualizar el documento existente
          const updatedAvailability = [...availabilityDoc.slots];

          // Recorrer las horas seleccionadas y actualizar o agregar nuevas
          availability.forEach(({ date, time, status }) => {
            const index = updatedAvailability.findIndex(
              (slot) => slot.date === date && slot.time === time
            );

            if (index === -1) {
              // Si no existe, agregar la nueva disponibilidad
              updatedAvailability.push({ date, time, status });
            } else {
              // Si ya existe, actualizar el estado
              updatedAvailability[index].status = status;
            }
          });

          // Actualizar el documento en Firestore
          await updateDoc(
            doc(db, "inspector_availability", availabilityDoc.id),
            {
              slots: updatedAvailability,
            }
          );
        } else {
          // Si no existe, crear un nuevo documento con la disponibilidad
          await addDoc(availabilityRef, {
            inspectorId: inspectorId,
            slots: availability.map(({ date, time, status }) => ({
              date,
              time,
              status,
            })),
          });
        }

        console.log("Disponibilidad guardada con éxito");
      } catch (error) {
        console.error("Error al guardar la disponibilidad: ", error);
        throw error; // Para capturarlo en el componente
      }
    },
  },
});
