import { defineStore } from "pinia";
import { db } from "src/boot/firebase";
import { collection, addDoc } from "firebase/firestore";

export const useEmailStore = defineStore("email", {
  state: () => ({
    documents: null,
    loading: false,
    error: null,
  }),

  actions: {
    async newUserInspector(data) {
      this.loading = true;
      this.error = null;
      try {
        const send = {
          to: [data.email],
          message: {
            subject: "Nuevo INSPECTOR Avaluo En Linea",
            text: "Hemos creado un usuario nuevo en Avaluo En Linea",
            html: `
                    <h4>Datos del ${data.role}:</h4>
                    <p>Nombre: ${data.name}<p/>
                    <p>Email: ${data.email}<p/>
                    <p>Password: ${data.password}<p/>
                    <p>Tipo de usuario: ${data.role}<p/>
                    <p>Administrador: ${data.admin}<p/>
                    <p>Contacto: ${data.contact}<p/>
                    `,
          },
        };

        await addDoc(collection(db, "mail"), send);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
