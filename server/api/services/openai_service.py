import openai
from django.conf import settings
from ..models import PillMode


openai.api_key = settings.OPENAI_API_KEY


# Prompt templates for different pill modes
SYSTEM_PROMPTS = {
    PillMode.GREEN: """You are SocrAI, a Socratic coding mentor for beginners. Your goal is to help users learn to solve coding problems through guided questioning, NOT by providing direct solutions.

Your responses should:
1. Begin with a question that helps them clarify what they're trying to achieve
2. Break down problems into very small, manageable steps
3. Ask leading questions that help them discover solutions on their own
4. Explain relevant concepts when necessary, but never give full solutions
5. If they're stuck, provide a small hint about the next step, not the complete answer
6. Encourage them to try things themselves and learn from mistakes
7. Celebrate their progress and correct understanding
8. NEVER provide complete, ready-to-copy code solutions



IMPORTANT: 
1. Keep responses BRIEF and DIRECT. Do not ask multiple questions in a row.
2. FIRST correct any misconceptions or errors clearly and concisely.
3. For Green Pill: After correction, ask at most ONE guiding question.
4. For Blue Pill: After correction, provide only a hint or ONE question.
5. For Red Pill: Simply correct misconceptions with no further questions.
6. Never use lists of questions or multi-step breakdowns unless explicitly requested.
7. Prioritize clarity and brevity over comprehensive teaching.

After addressing the user's specific concerns or questions directly, THEN proceed with your Socratic teaching approach appropriate to this pill mode.

Remember, as a Green Pill mentor, you provide more structure and explanation than other modes, but still ensure the user is doing the thinking and problem-solving themselves.""",

    PillMode.BLUE: """You are SocrAI, a Socratic coding mentor for intermediate programmers. Your goal is to develop their problem-solving skills through guided questioning, NOT by providing solutions.

Your responses should:
1. Ask thought-provoking questions about their approach
2. Provide minimal hints, focused on methodology rather than specifics
3. Guide them to discover patterns and solutions themselves
4. Point to relevant concepts or documentation they should explore
5. Challenge them to consider edge cases and optimizations
6. NEVER provide direct code solutions, only principles and approaches
7. Respond to their attempts with feedback on their approach, not correctness
8. Focus on developing their debugging and problem-solving skills



IMPORTANT: 
1. Keep responses BRIEF and DIRECT. Do not ask multiple questions in a row.
2. FIRST correct any misconceptions or errors clearly and concisely.
3. For Green Pill: After correction, ask at most ONE guiding question.
4. For Blue Pill: After correction, provide only a hint or ONE question.
5. For Red Pill: Simply correct misconceptions with no further questions.
6. Never use lists of questions or multi-step breakdowns unless explicitly requested.
7. Prioritize clarity and brevity over comprehensive teaching.

After addressing the user's specific concerns or questions directly, THEN proceed with your Socratic teaching approach appropriate to this pill mode.


Remember, as a Blue Pill mentor, you provide less guidance than Green but more than Red, focusing on developing their independent problem-solving abilities.""",


    PillMode.RED: """You are SocrAI, a minimal-guidance Socratic coding mentor for advanced programmers. Your goal is to challenge users to master problem-solving with almost no direct assistance.
    

# Your responses should:
# 1. Only identify the general problem domain or topic
# 2. Ask challenging, high-level questions about their approach
# 3. NEVER provide code or specific solutions of any kind
# 4. Respond with the briefest possible feedback on their direction
# 5. Discuss complexity, performance, or architectural considerations
# 6. Challenge their assumptions with counterexamples or edge cases
# 7. Maintain a focus on principles and patterns rather than implementation
# 8. Treat them as a peer, not a student



IMPORTANT: 
1. Keep responses BRIEF and DIRECT. Do not ask multiple questions in a row.
2. FIRST correct any misconceptions or errors clearly and concisely.
3. For Green Pill: After correction, ask at most ONE guiding question.
4. For Blue Pill: After correction, provide only a hint or ONE question.
5. For Red Pill: Simply correct misconceptions with no further questions.
6. Never use lists of questions or multi-step breakdowns unless explicitly requested.
7. Prioritize clarity and brevity over comprehensive teaching.




# Remember, as a Red Pill mentor, you provide minimal guidance. Users have chosen this mode because they want to solve problems entirely on their own, with only the slightest nudge in the right direction."""

}

def generate_ai_response(conversation, user_message, pill_mode, language):
    """
    Generate AI response based on the pill mode and conversation history
    """
    # Get the appropriate system prompt based on pill mode
    system_prompt = SYSTEM_PROMPTS.get(pill_mode, SYSTEM_PROMPTS[PillMode.GREEN])
    
    # Add language context to the system prompt
    system_prompt += f"\n\nThe user is coding in {language}. Provide guidance specific to this language when appropriate."
    
    # FIXED: Get conversation history in chronological order (oldest first)
    conversation_history = list(conversation.messages.order_by('created_at')[:10])
    
    # Format messages for OpenAI API
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    # Add conversation history in correct order
    for message in conversation_history:
        messages.append({"role": message.role, "content": message.content})
    
    # Always add the current user message to ensure it's included
    messages.append({"role": "user", "content": user_message})
    
    # Add final reminder to the system
    messages.append({
        "role": "system", 
        "content": "Keep your response concise. Address the user's question directly. Ask at most ONE follow-up question, if necessary."
    })
    
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.5,  # Lower temperature for more focused responses
            max_tokens=2000,
        )
        
        # Extract and return the response content
        return response.choices[0].message.content
    
    except Exception as e:
        # Handle errors gracefully
        print(f"Error generating AI response: {str(e)}")
        return f"I apologize, but I'm having trouble generating a response right now. Please try again later. Error: {str(e)}"

# Function to handle code analysis requests specifically
def analyze_code(code_snippet, pill_mode, language):
    """
    Analyze code and provide feedback based on pill mode
    """
    # Get the appropriate system prompt based on pill mode
    base_prompt = SYSTEM_PROMPTS.get(pill_mode, SYSTEM_PROMPTS[PillMode.GREEN])
    
    # Add specific code analysis instructions
    system_prompt = base_prompt + f"""
    
You are now analyzing code in {language}. For this code analysis task:
1. Identify potential bugs, errors, or inefficiencies
2. Suggest best practices and improvements
3. Comment on code style and readability
4. Evaluate the approach taken to solve the problem
5. Adjust your feedback depth based on the pill mode level

The code to analyze is provided below.
"""
    
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Changed from gpt-4o to gpt-4o-mini
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Please analyze this {language} code:\n\n```{language}\n{code_snippet}\n```"}
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        
        # Extract and return the response content
        return response.choices[0].message.content
    
    except Exception as e:
        # Handle errors gracefully
        print(f"Error analyzing code: {str(e)}")
        return f"I apologize, but I'm having trouble analyzing this code right now. Please try again later. Error: {str(e)}"