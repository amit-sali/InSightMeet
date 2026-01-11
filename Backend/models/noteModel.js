import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  // Link to user who owns this note
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Fast queries by user
  },
  
  // Note title (auto-generated or user-provided)
  title: {
    type: String,
    required: [true, 'Note title is required'],
    maxLength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  
  // Source type of the original file
  sourceType: {
    type: String,
    enum: ['audio', 'video'],
    required: [true, 'Source type is required']
  },
  
  // Original filename for reference
  originalFilename: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  
  // Cloudinary URL for the generated PDF
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
    trim: true
  },
  
  // Cloudinary public ID for PDF management
  pdfPublicId: {
    type: String,
    required: [true, 'PDF public ID is required'],
    trim: true
  },
  
  // File size in bytes
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative']
  },
  
  // Duration of original audio/video in seconds
  duration: {
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  
  // Word count of the generated notes
  wordCount: {
    type: Number,
    min: [0, 'Word count cannot be negative']
  },
  
  // AI model used for note generation
  aiModel: {
    type: String,
    default: 'gpt-4o-mini'
  },
  
  // Processing status
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Compound index for efficient user queries with sorting
noteSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted creation date
noteSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Ensure virtuals are included in JSON output
noteSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Note', noteSchema);