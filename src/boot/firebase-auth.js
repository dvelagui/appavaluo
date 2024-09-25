import { boot } from 'quasar/wrappers'
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { useUserStore } from 'src/stores/users'
import { useDatabaseStore } from 'src/stores/database' // Import database store

export default boot(async ({ app, store }) => {
  const auth = getAuth()

  const userStore = useUserStore(store)

  // Ensure session persistence on reload
  await setPersistence(auth, browserLocalPersistence)
  const databaseStore = useDatabaseStore(store) // Create instance of database store
  // Firebase onAuthStateChanged to manage user session
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userStore.user = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      }

      // Fetch user data from Firestore based on UID
      await databaseStore.fetchUserData(user.uid)
    } else {
      userStore.user = null
      databaseStore.userData = null // Clear user data on logout
    }
  })

  // If you need to use the auth object in your components, you can globally provide it
  app.config.globalProperties.$auth = auth
})
