import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';

// Load environment variables first
dotenv.config({ path: './config/config.env' });

const port = process.env.PORT || 8000;

connectMongoDatabase();


//HANDLE UNCAUGHT EXCEPTION ERROR
process.on('uncaughtException', (err) => {
  console.log(`Error  ${err.message}`);
  console.log(`server is shutting down due to uncaught exception errors`);
  process.exit(1);
})

const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});



process.on('unhandledRejection', (err) => {
  console.log(`Error ${err.message}`);
  console.log(`server is shutting down , due to un handled promise rejection`);
  server.close(() => {
    process.exit(1)
  })
})