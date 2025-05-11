const bcrypt = require("bcryptjs");
const User = require("../models/User");

const admin = {
    email: "admin@gmail.com",
    password: bcrypt.hashSync('0000', 10)
};

async function adminUpdateUser(req, res) {
    try {
        const { userID, userFirst, userLast, userEmail } = req.body;
        
        if(!userID || !userFirst || !userLast || !userEmail ){
            return res
            .status(400) 
            .json({message:'All fields are required'})
        }
        const user = await User.findById(userID);
        
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found" });
        }
        user.firstname = userFirst;
        user.lastname = userLast;
        user.email = userEmail;
        await user.save();

        console.log("Updated user: ", user);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
    }

}


async function adminDeleteUser(req, res) {
    console.log("Here");
    try {
        const { userID } = req.body;
        if(!userID){
            return res
            .status(400) 
            .json({message:'Could not find user ID'})
        }
        const user = await User.findById(userID);
        
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found in database" });
        }
        await user.remove();

        console.log("Deleted user: ", user);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(error);
    }

}
async function adminAuthentication(req, res) {
    try {
        const { email, password } = req.body;
        if(!email || !password ){
        return res
        .status(400) 
        .json({message:'All fields are required'})
        }

        if(admin.email != email){
        return res
        .status(401)
        .json({message:'Incorrect email or password' }) 
        }
        const auth = await bcrypt.compare(password, admin.password)
        if (!auth) {
        return res
        .status(403)
        .json({message:'Incorrect email or password' }) 
        }

        // session
        req.session.adminId = 'admin0000' 
        req.session.isAdmin = true;
        res.status(200).json({
        success: true,
        message: "Admin logged in and session initialized successfully",
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { adminAuthentication, adminUpdateUser, adminDeleteUser };