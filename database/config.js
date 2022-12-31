import mongoose from "mongoose"

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS);
        console.log("Base de datos levantada exitosamente");
    } catch (error) {
        console.log(error);
        throw new Error("Error a la hora de iniciar la base de datos")
    }
}

export default dbConnection;