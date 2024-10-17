const form = document.getElementById('searchForm');
const imageGrid = document.getElementById('imageGrid');
const orientationButtons = document.querySelectorAll('.orientation-btn');
const colorInput = document.getElementById('color');

let selectedOrientation = '';

orientationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedOrientation = button.dataset.orientation;
    orientationButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const keyword = document.getElementById('keyword').value;
  const color = colorInput.value;
  const countInput = document.getElementById('count').value;

  let apiUrl = `https://api.unsplash.com/search/photos?query=${keyword}&client_id=zlaJUc6wQxPJ7aVnb21QtyIKXTbHrsyTBd49lJZfY9I`;

  if (color) {
      apiUrl += `&color=${color.toLowerCase()}`;
  }

  if (selectedOrientation) {
    apiUrl += `&orientation=${selectedOrientation}`;
  }

  if (countInput) {
    apiUrl += `&per_page=${countInput}`;
  } else {
    apiUrl += '&per_page=6';
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    imageGrid.innerHTML = '';

    data.results.forEach((image) => {
      const img = document.createElement('img');
      img.src = image.urls.regular;
      img.alt = image.alt_description;
      img.classList.add('image');

      // Trigger download event when image is clicked
      img.addEventListener('click', () => {
        triggerDownloadEvent(image.links.download_location);
      });

      const photographerLink = document.createElement('a');
      photographerLink.href = `${image.user.links.html}?utm_source=your_app_name&utm_medium=referral`;
      photographerLink.target = '_blank';
      photographerLink.textContent = image.user.name;

      const unsplashLink = document.createElement('a');
      unsplashLink.href = `https://unsplash.com/?utm_source=your_app_name&utm_medium=referral`;
      unsplashLink.target = '_blank';
      unsplashLink.textContent = 'Unsplash';

      const attribution = document.createElement('p');
      attribution.innerHTML = `Photo by ${photographerLink.outerHTML} on ${unsplashLink.outerHTML}`;

      const container = document.createElement('div');
      container.classList.add('image-container');
      container.appendChild(img);
      container.appendChild(attribution);

      imageGrid.appendChild(container);
    });
  } catch (error) {
    console.log('Error:', error);
  }
});

// Function to trigger the download event
async function triggerDownloadEvent(downloadLocation) {
  try {
    await fetch(downloadLocation, {
      method: 'GET',
      headers: {
        'Authorization': 'Client-ID zlaJUc6wQxPJ7aVnb21QtyIKXTbHrsyTBd49lJZfY9I'
      }
    });
    console.log('Download event triggered successfully');
  } catch (error) {
    console.log('Error triggering download event:', error);
  }
}
