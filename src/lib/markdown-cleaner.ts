/**
 * Utility function to clean markdown formatting from text for TTS
 * This removes all markdown syntax while preserving the actual content
 */

export function cleanMarkdown(text: string): string {
  return text
    // Remove markdown headers (e.g., # ## ###)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic formatting
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    // Remove code formatting
    .replace(/`(.*?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, "$1")
    // Convert links to just the text
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove image markdown
    .replace(/!\[(.*?)\]\(.*?\)/g, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, "")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Collapse multiple newlines and spaces
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    // Remove any remaining markdown symbols
    .replace(/[#*_~`>-]+/g, "")
    .trim();
}

/**
 * Test cases for the markdown cleaning function
 * Run this in development to verify the function works correctly
 */
export function testMarkdownCleaning() {
  const testCases = [
    {
      input: "# Hello World\nThis is **bold** and *italic* text.",
      expected: "Hello World\nThis is bold and italic text."
    },
    {
      input: "Here's a [link](https://example.com) and some `code`.",
      expected: "Here's a link and some code."
    },
    {
      input: "- List item 1\n- List item 2\n1. Numbered item",
      expected: "List item 1\nList item 2\nNumbered item"
    },
    {
      input: "> This is a blockquote\n\n---\n\n**Bold text** with `inline code`",
      expected: "This is a blockquote\n\nBold text with inline code"
    },
    {
      input: "```\nCode block\n```\nRegular text",
      expected: "Regular text"
    }
  ];

  console.log("🧪 Testing Markdown Cleaning Function:");
  
  testCases.forEach((testCase, index) => {
    const result = cleanMarkdown(testCase.input);
    const passed = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${passed ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: "${testCase.expected}"`);
    console.log(`Result: "${result}"`);
    console.log("---");
  });
}

// Export the test function for development use
if (process.env.NODE_ENV === 'development') {
  // Auto-run tests in development
  setTimeout(() => {
    testMarkdownCleaning();
  }, 1000);
} 