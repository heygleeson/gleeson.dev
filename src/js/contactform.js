const SEND_MAIL = false;

function wait(seconds) {return new Promise((resolve) => setTimeout(resolve, seconds * 1000));}

// Collect element IDs
const DOM = {
	// Contact Form
	contactForm: "contactForm",
	nameInput: "nameInput",
	emailInput: "emailInput",
	subjectInput: "subjectInput",
	messageInput: "messageInput",
	contactSubmit: "contactSubmit"
};
for (const i in DOM) {DOM[i] = document.getElementById(DOM[i]);}

// Insert Temporary Inputs
DOM.nameInput.value = "Andy";
DOM.emailInput.value = "my@email.com";
DOM.subjectInput.value = "I have a question..."
DOM.messageInput.value = "Hello there! I have a question! What software do you use?";

// Add event listener on form submit
DOM.contactSubmit.addEventListener("click", async (event) => {
	const input = {
		name 	: DOM.nameInput.value,
		subject : DOM.subjectInput.value,
		email 	: DOM.emailInput.value,
		message : DOM.messageInput.value
	}

	DOM.nameInput.disabled = true;
	DOM.emailInput.disabled = true;
	DOM.subjectInput.disabled = true;
	DOM.messageInput.disabled = true;
	DOM.contactSubmit.innerText = "...SENDING...";
	await wait(2);
	submitEmail(input);
	return false;
});
// The cool function
function submitEmail(input) {
	// Sanitise Input
	let error = false;
	// TODO: sanitise
	if (error) {console.error(error);}
	// Input is ready to submit.
	const options = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(input)
	};

	if (SEND_MAIL) {
		return fetch("/contact", options).then(res => {
			DOM.contactForm.textContent = "";
			const reponseMessage = document.createElement("p");
			reponseMessage.classList.add("contactResponse");
			if (res.status == 200) {
				// Success
				console.log("Message was sent successfully");
				reponseMessage.innerText = "Thank you! ❤";		
			} else {
				// Error
				console.error("Error sending the message");
				reponseMessage.innerText = "Unexpected Error. Please try again.";
			}
			DOM.contactForm.appendChild(reponseMessage);	
		});
	} else {
		// Opt 1. Remove all Content
		// DOM.contactForm.textContent = "";

		// Opt 2. Disable all fields
		DOM.contactSubmit.disabled = true;
		DOM.contactSubmit.innerText = "SENT";

		const reponseMessage = document.createElement("p");
		reponseMessage.classList.add("contactResponse");
		reponseMessage.innerText = "Thank you! ❤ [TESTING]";	
		DOM.contactForm.appendChild(reponseMessage);
		return false;
	}
}