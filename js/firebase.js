const firebaseConfig = {
    apiKey: "AIzaSyCm9GeIcOtrR3cbWv0fSash5sT7sL9S1rk",
    authDomain: "testwebapp-4db03.firebaseapp.com",
    projectId: "testwebapp-4db03",
    storageBucket: "testwebapp-4db03.firebasestorage.app",
    messagingSenderId: "838164449927",
    appId: "1:838164449927:web:279f3b6e72fdffabde0622"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const ADMIN_EMAIL = 'az99arseniy@gmail.com';