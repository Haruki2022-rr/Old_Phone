import bcrypt from 'bcryptjs';

const admin = {
    email: "admin@gmail.com",
    password: bcrypt.hashSync('0000', 10)
  };
  
export async function adminAuthentication(req, res) {
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