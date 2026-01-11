import OpenAI from 'openai';

// Generate structured notes from transcript using OpenAI
export const generateStructuredNotes = async (transcript) => {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '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'
    });

    console.log('Starting OpenAI notes generation...');

    // Craft prompt for structured notes
    const prompt = `
You are an expert note-taker and content organizer. Convert the following transcript into well-structured, professional notes.

INSTRUCTIONS:
1. Create clear headings and subheadings
2. Use bullet points for key information
3. Identify and highlight main topics
4. Add a brief summary at the end
5. Remove filler words and repetitions
6. Organize content logically
7. Use markdown formatting

TRANSCRIPT:
${transcript}

Please generate structured notes in the following format:
# [Main Topic/Title]

## Key Points
- [Main point 1]
- [Main point 2]
- [Main point 3]

## Detailed Notes
### [Subtopic 1]
- [Detail 1]
- [Detail 2]

### [Subtopic 2]
- [Detail 1]
- [Detail 2]

## Summary
[Brief summary of the main content and key takeaways]

## Action Items (if any)
- [Action item 1]
- [Action item 2]
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional note-taking assistant. Create clear, well-organized notes from transcripts.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    const structuredNotes = response.choices[0].message.content;

    console.log('OpenAI notes generation completed');

    return {
      originalTranscript: transcript,
      structuredNotes: structuredNotes,
      wordCount: structuredNotes.split(' ').length,
      model: 'gpt-4o-mini',
      processedAt: new Date()
    };

  } catch (error) {
    console.error('OpenAI notes generation error:', error);
    throw new Error('Failed to generate structured notes: ' + error.message);
  }
};