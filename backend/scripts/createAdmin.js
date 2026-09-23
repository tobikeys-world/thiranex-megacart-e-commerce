const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "admin@megacart.com";
        const adminPassword = "MegaCartAdmin123";

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const existingAdmin = await User.findOne({
            email: adminEmail,
        });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";
            existingAdmin.name = "MegaCart Admin";

            await existingAdmin.save();

            console.log("Admin account updated successfully.");
        } else {
            await User.create({
                name: "MegaCart Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });

            console.log("MegaCart admin created successfully.");
        }

        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to create/update admin:", error.message);
        process.exit(1);
    }
};

createAdmin();