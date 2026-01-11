import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';
import { scheduleCleanup } from './utils/cleanupService.js';

// Load environment variables first
dotenv.config({ path: './config/config.env' });

// Debug: Check if environment variables are loaded
console.log('=== Environment Variables Debug ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ASSEMBLYAI_API_KEY:', process.env.ASSEMBLYAI_API_KEY ? 'Loaded' : 'Missing');
console.log('ASSEMBLYAI_API_KEY length:', process.env.ASSEMBLYAI_API_KEY?.length);
console.log('===================================');

const port = process.env.PORT || 8000;

connectMongoDatabase();

// Start file cleanup scheduler
scheduleCleanup();


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