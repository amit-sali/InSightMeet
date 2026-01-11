import fs from 'fs';
import path from 'path';
import cron from 'node-cron';

// Clean up old temporary files
export const cleanupTempFiles = () => {
  const uploadsDir = './uploads';
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  try {
    if (!fs.existsSync(uploadsDir)) {
      return;
    }

    const files = fs.readdirSync(uploadsDir);
    let cleanedCount = 0;

    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);

      // Skip directories
      if (stats.isDirectory()) {
        return;
      }

      // Check if file is older than maxAge
      const fileAge = Date.now() - stats.mtime.getTime();
      if (fileAge > maxAge) {
        try {
          fs.unlinkSync(filePath);
          cleanedCount++;
          console.log(`Cleaned up old file: ${file}`);
        } catch (error) {
          console.error(`Failed to delete file ${file}:`, error.message);
        }
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cleanup completed: ${cleanedCount} files removed`);
    }

  } catch (error) {
    console.error('Cleanup error:', error.message);
  }
};

// Schedule cleanup to run every 6 hours
export const scheduleCleanup = () => {
  // Run cleanup every 6 hours
  cron.schedule('0 */6 * * *', () => {
    console.log('Running scheduled file cleanup...');
    cleanupTempFiles();
  });

  // Run cleanup on startup
  setTimeout(() => {
    console.log('Running startup file cleanup...');
    cleanupTempFiles();
  }, 5000);
};

// Clean up files for a specific user (when user deletes account)
export const cleanupUserFiles = async (userId) => {
  try {
    // This would be implemented when user deletion is added
    console.log(`Cleaning up files for user: ${userId}`);
    // Implementation would go here
  } catch (error) {
    console.error('User file cleanup error:', error.message);
  }
};