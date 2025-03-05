// /src/services/sendToAI.ts

// Define a generic interface for the AI response.
export interface AIResponse {
    [key: string]: any;
  }
  
  export async function sendToAI(formattedData: any): Promise<AIResponse | null> {
    // Replace with your actual AI endpoint URL.
    const aiEndpoint = "https://api.thegraph.com/subgraphs/name/0xA1e9-7e3F93/committestgroan";
  
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const result = await response.json();
      console.log("AI response:", result);
      return result as AIResponse;
    } catch (error) {
      console.error("Error sending data to AI", error);
      return null;
    }
  }
  