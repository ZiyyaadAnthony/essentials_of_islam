console.log("Script started...");
const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync("seed-data.json", "utf8"));

async function seed() {
  console.log("Seeding paths...");
  for (const path of data.paths) {
    await db.collection("paths").doc(path.id).set(path);
  }

  console.log("Seeding lessons...");
  for (const lesson of data.lessons) {
    await db.collection("lessons").doc(lesson.id).set(lesson);
  }

  console.log("Done.");
  process.exit();
}

seed();
