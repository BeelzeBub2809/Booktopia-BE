
const { initializeApp } = require("firebase/app");
const { Buffer } = require("buffer");
const { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject  } = require("firebase/storage");
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

async function uploadImage(base64Images, name, typeName) {
    const uploadPromises = base64Images.map((base64Image, index) => {
        const buffer = Buffer.from(base64Image, 'base64');
        const metadata = {
            contentType: 'image/jpeg',
        };

        return new Promise((resolve, reject) => {
            try {
                const storageRef = ref(storage, `images/${typeName}/${name}_${index}`);
                const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Progress tracking (optional)
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
            } catch (uploadError) {
                reject(uploadError);
            }
        });
    });

    try {
        const imageUrls = await Promise.all(uploadPromises);
        return imageUrls;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteImages(imageUrls) {
    const deletePromises = imageUrls.map(async (imageUrl) => {
        try {
            const storagePath = imageUrl.split(`${firebaseConfig.storageBucket}/o/`)[1].split('?')[0];
            const decodedPath = decodeURIComponent(storagePath); // Decode URL-encoded characters

            const imageRef = ref(storage, decodedPath);

            await deleteObject(imageRef);
            console.log(`Image deleted successfully: ${imageUrl}`);
        } catch (error) {
            console.error(`Failed to delete image: ${imageUrl}`, error.message);
        }
    });

    await Promise.all(deletePromises);
}


const Extension = {
    uploadImage, upload, deleteImages
}

module.exports = Extension;