const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");


main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68eb970f1b8f2fd6a4bbb4a4"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();