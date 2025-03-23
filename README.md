Here’s the final documentation for your database code that you can copy into your README:  

---

# Database Component Documentation  

## Overview  
This database setup contains user profiles and their associated plant data for the smart irrigation system. It is structured to allow storing, uploading, and retrieving user and plant information from Firebase Realtime Database.  

## Data Structure  

### Users Collection  
- **id** (integer)  
- **firstName** (string)  
- **lastName** (string)  
- **email** (string)  
- **password** (string)  
- **profilePicture** (string - image path)  
- **plants** (array of plant objects)  

### Plant Object Structure (inside each user)  
- **id** (integer)  
- **name** (string)  
- **type** (string)  
- **imageUrl** (string - image path)  
- **metrics** (object)  
  - **humidity** (float)  
  - **pHLevel** (float)  
  - **nutrients** (object)  
    - **nitrogen** (float)  
    - **phosphorus** (float)  
    - **potassium** (float)  

---

## Server Import Script Overview  
- The server script uses **Firebase Admin SDK** to upload the user and plant data from `db.js` to the Firebase Realtime Database.  
- It initializes Firebase using a service account JSON key and uses environment variables to access the database URL.  
- The script loops through each user and uploads them under the `users/` reference, with the user ID as a key.  
- Once run, all users and their plant data become available in the Firebase console for use by the smart irrigation system app.  

