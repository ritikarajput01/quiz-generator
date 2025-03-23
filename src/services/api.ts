
import { Question, Difficulty } from '../context/QuizContext';
import { toast } from 'sonner';

// Get OpenRouter API key from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

interface ApiResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateQuiz(topic: string, difficulty: Difficulty, numQuestions: number = 5): Promise<Question[]> {
  try {
    // Create a more explicit prompt that encourages proper JSON formatting
    const prompt = `Generate a ${numQuestions}-question multiple-choice quiz on the topic of "${topic}" with ${difficulty} difficulty level. 
    
Format the response as a valid JSON array with each question having the following structure:
{
  "text": "Question text here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0 // Index of the correct answer (0-3)
}

It is absolutely critical that your response ONLY contains the properly formatted JSON array, with no additional text before or after. Please ensure all JSON syntax is valid with correct commas, brackets, and quotes. The difficulty should be appropriate for ${difficulty} level.`;

    console.log("Sending request to generate quiz about:", topic);
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'QuizCrafter AI'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5, // Lower temperature for more predictable JSON formatting
        max_tokens: 1500, // Ensure we have enough tokens for the response
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: ApiResponse = await response.json();
    
    const content = data.choices[0].message.content;
    console.log("Raw API response:", content);
    
    // Try several JSON extraction methods in sequence
    let parsedQuestions;
    
    // Method 1: Direct parsing if the response is clean JSON
    try {
      parsedQuestions = JSON.parse(content);
      console.log("Successfully parsed JSON directly");
    } catch (error) {
      console.log("Direct JSON parse failed, trying regex extraction");
      
      // Method 2: Extract JSON array using regex
      const jsonArrayRegex = /\[\s*\{[\s\S]*\}\s*\]/m;
      const match = content.match(jsonArrayRegex);
      
      if (match) {
        try {
          parsedQuestions = JSON.parse(match[0]);
          console.log("Successfully parsed JSON using regex extraction");
        } catch (parseError) {
          console.error("Regex extraction found content but parsing failed:", parseError);
          
          // Method 3: Try to fix common JSON errors
          try {
            // Fix common JSON issues like trailing commas and missing quotes
            let fixedJson = match[0]
              .replace(/,\s*}/g, "}") // Remove trailing commas in objects
              .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure property names have quotes
              .replace(/}\s*{/g, "},{"); // Add commas between objects
              
            parsedQuestions = JSON.parse(fixedJson);
            console.log("Successfully parsed JSON after fixing common errors");
          } catch (fixError) {
            console.error("Failed to fix and parse JSON:", fixError);
            throw new Error("Failed to parse quiz data. The AI response contained invalid JSON.");
          }
        }
      } else {
        console.error("No JSON array found in the response");
        throw new Error("Failed to extract JSON from the API response. Please try again with a different topic.");
      }
    }
    
    // Validate the structure of parsed questions
    if (!Array.isArray(parsedQuestions)) {
      console.error("Parsed result is not an array:", parsedQuestions);
      throw new Error("Invalid quiz format: expected an array of questions");
    }
    
    // Check minimum length
    if (parsedQuestions.length === 0) {
      throw new Error("No questions were returned by the AI. Please try again with a different topic.");
    }
    
    // Map and validate each question
    const validatedQuestions = parsedQuestions.map((q: any, index: number) => {
      if (!q.text || !Array.isArray(q.options) || q.correctAnswer === undefined) {
        console.error(`Question at index ${index} has invalid format:`, q);
        throw new Error(`Invalid question format for question ${index + 1}. Please try again.`);
      }
      
      // Ensure at least 2 options
      if (q.options.length < 2) {
        console.error(`Question at index ${index} has too few options:`, q);
        throw new Error(`Question ${index + 1} has too few options. Please try again.`);
      }
      
      // Ensure correctAnswer is within bounds
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        console.error(`Question at index ${index} has invalid correctAnswer:`, q);
        // Fix the correctAnswer if possible
        q.correctAnswer = 0;
      }
      
      return {
        id: index,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer
      };
    });
    
    console.log("Successfully generated quiz with", validatedQuestions.length, "questions");
    return validatedQuestions;
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate quiz. Please try again with a different topic.');
    throw error;
  }
}

// Update the API key management functions
export function setApiKey(key: string): void {
  // In a real application, you might want to store this in a more secure way
  // For a demo, we're just using localStorage
  localStorage.setItem('OPENROUTER_API_KEY', key);
}

export function getApiKey(): string {
  return OPENROUTER_API_KEY || localStorage.getItem('OPENROUTER_API_KEY') || '';
}
