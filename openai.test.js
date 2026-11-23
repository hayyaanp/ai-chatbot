const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    "model": "gpt-6-luna",
    "reasoning": { effort: "none" },
    "input": "Write a one-sentence bedtime story about a unicorn."
  })
});

if (!response.ok) {
  const error = await response.json();
  console.log("API Error", error);
} else {
  const data = await response.json();
  data.output_text = data.output
    .filter(item => item.type === "message")
    .flatMap(item => item.content)
    .filter(part => part.type === "output_text")
    .map(part => part.text)
    .join("");

  console.log(data.output_text);
}