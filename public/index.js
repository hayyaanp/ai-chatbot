// target the DOM elements
const inputField = document.getElementById("input-field");
const sendButton = document.getElementById("send-button");
const responseP = document.getElementById("response");

// frontend makes a request to the /api/chat server endpoint
async function getData(input) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error(`status : ${response.status}`, `error: ${data.error}`);
    }
    const data = await response.json();
    responseP.textContent = data.result || data.error;
    console.log(data.result);
  } catch (error) {
    console.error(error);
  }
}

// listen for button click
sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  getData(inputField.value);
})
