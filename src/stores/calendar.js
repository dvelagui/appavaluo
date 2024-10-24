// src/stores/calendar.js
import { defineStore } from "pinia";
import { doc, setDoc, getDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "src/boot/firebase";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    inspectorAvailability: [],
    selectedInspector: null,
  }),

  actions: {
    async createDefaultAvailability(inspectorId) {
      const defaultAvailability = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ].map((day) => ({
        day,
        startTime: "08:00",
        endTime: "16:00",
        exceptions: [],
      }));

      await setDoc(doc(collection(db, "inspector_availability"), inspectorId), {
        inspectorId,
        availability: defaultAvailability,
      });
    },

    async fetchAvailability(inspectorId) {
      console.log("Fetching availability for inspector:", inspectorId);

      const docRef = doc(db, "inspector_availability", inspectorId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        this.inspectorAvailability = snapshot.data().availability;
      }
    },

    async addException(inspectorId, date) {
      const docRef = doc(db, "inspector_availability", inspectorId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const availability = data.availability.map((day) => {
          if (day.day === date.day) {
            day.exceptions.push(date.exception);
          }
          return day;
        });

        await updateDoc(docRef, { availability });
      }
    },
  },
});
