const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb+srv://donvix7:nWwAv2zExfKRfJJK@cluster0.we8dlfh.mongodb.net/?appName=Cluster0');
    const Resident = mongoose.model('Resident', new mongoose.Schema({}));
    const rCount = await Resident.countDocuments();
    const User = mongoose.model('User', new mongoose.Schema({}));
    const uCount = await User.countDocuments();
    console.log('Residents:', rCount);
    console.log('Users:', uCount);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
