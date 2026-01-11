import express from 'express';
import user from './routes/userRoutes.js'
import media from './routes/mediaRoutes.js'
import notes from './routes/noteRoutes.js'
import errorHandleMiddleware from './middleware/error.js'
import cookieParser from 'cookie-parser';
// import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ye zaroori hai warna req.body undefined rahega
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware 
app.use(cookieParser());
// app.use(fileUpload());



app.use("/api/v1",user);
app.use("/api/v1/media",media);
app.use("/api/v1/notes",notes);

app.use(errorHandleMiddleware);

export default app;
