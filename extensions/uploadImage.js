
const { initializeApp } = require("firebase/app");
const { Buffer } = require("buffer");
const { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } = require("firebase/storage");
const multer = require('multer');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const upload = multer({ storage: multer.memoryStorage() });

async function uploadImage(base64Image, name, typeName) {
    const buffer = Buffer.from(base64Image, 'base64');
    const metadata = {
        contentType: 'image/jpeg',
    };
  
    try {
        const storageRef = ref(storage, `images/${typeName}/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);
  
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(imageUrl);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    } catch (uploadError) {
        throw new Error(uploadError.message);
    }
  }

const Extension = {
    uploadImage
}

module.exports = Extension;