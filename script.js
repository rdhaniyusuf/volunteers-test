// navbar sticky

if (PerformanceNavigationTiming === 1) {
	// Page is refreshed, remove the sticky class
	let header = document.querySelector('.header');

	header.classList.remove('sticky');
}

window.onscroll = () => {
	let header = document.querySelector('.header');
	if (window.scrollY > 20) {
		header.classList.add('sticky');

	} else {
		header.classList.remove('sticky');
	}
};

// modal show

const openSearchModal = document.getElementById('openSearchModal');
const closeSearchModal = document.querySelector('.close-search-btn');

const searchModal = document.getElementById('searchModal');

const closeInfoModal = document.querySelector('.close-info-btn');
const infoModal = document.getElementById('infoModal');

openSearchModal.onclick = function () {
	searchModal.style.display = 'flex';
};

closeSearchModal.onclick = function () {
	searchModal.style.display = 'none';
}

closeInfoModal.onclick = function () {
	infoModal.style.display = 'none';
};



const scriptURL = 'https://script.google.com/macros/s/AKfycbwBxYzMbFAb0MuH3Dt6BeNFX-I3363g-iAcm6zYWQwOHqvEQ4tjYJN3R51kyJYXyBWfCQ/exec';

document.getElementById('join-form').addEventListener('submit', function (event) {
	event.preventDefault();

	var formData = new FormData(this);

	var jsonObject = {};
	formData.forEach(function (value, key) {
		jsonObject[key] = value;
	});

	var fileInput = document.getElementById('image');
	var file = fileInput.files[0];

	if (file) {
		var reader = new FileReader();
		reader.onloadend = function () {
			jsonObject['image'] = reader.result; // Add the base64-encoded image to the JSON object
			sendData(jsonObject); // Send data to the server
		};
		reader.readAsDataURL(file);
	} else {
		sendData(jsonObject); // Send data to the server
	}
});

function sendData(data) {
	// Fetch API to send data to Google Apps Script
	console.log(data);
	fetch(scriptURL, {
		method: 'POST',
		body: JSON.stringify(data)
	})
		.then(response => {
			console.log('success :', response);
		})
		.catch((error) => {
			console.error('Error:', error);
			// Handle errors, if needed
		});
}


window.onload = function () {
  // Add an event listener to the form submission
  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the searchId from the input field
    var searchId = document.getElementById('searchId').value;

    // Create URLSearchParams object to append query parameters
    var urlParams = new URLSearchParams();
    urlParams.append('searchId', searchId);

    // Make a GET request to your server with the searchId as a query parameter
    fetch(scriptURL + "?" + urlParams.toString())
      .then(response => response.json())
      .then(data => {
        // Process the JSON data and update the HTML
        handleJsonResponse(data);
		console.log(data);
      })
      .catch(error => console.error('Error:', error));
	  searchModal.style.display = 'none';
  });
};

function handleJsonResponse(data) {
  // Get the search result div
  var resultDiv = document.querySelector('.info-wrapper');

  // Check if data is not empty
  if (!data || !data.row) {
    resultDiv.innerHTML = '<p>No data found.</p>';
    return;
  }

  // Extract the 'row' object from the data
  var row = data.row;

  // Display the base64-encoded image
  document.getElementById('imageDisplay').src = 'data:image/png;base64,' + row.imageBase64;

  // Display the name
  document.getElementById('name').textContent = row.name;

  // Display the address
  document.getElementById('location').textContent = row.location;

  // Display the base64-encoded QR code
  document.getElementById('qrCodeDisplay').src = 'data:image/png;base64,' + row.qrcodeBase64;
  infoModal.style.display = 'flex';
}