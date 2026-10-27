```javascript
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    results.innerHTML = "";
    resultCount.textContent = "Please enter a search term.";
    return;
  }

  results.innerHTML = "";
  resultCount.textContent = "Loading images...";

  try {
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch images.");
    }

    const data = await response.json();
    const images = Object.values(data.query?.pages || {});

    results.innerHTML = "";

    images.forEach((image) => {
      const imageUrl = image.imageinfo?.[0]?.thumburl ||
                       image.imageinfo?.[0]?.url;

      if (!imageUrl) return;

      const card = document.createElement("article");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = image.title;
      img.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent = image.title.replace("File:", "");

      card.appendChild(img);
      card.appendChild(caption);
      results.appendChild(card);
    });

    resultCount.textContent = `${images.length} images found.`;

    if (images.length === 0) {
      resultCount.textContent = "No images found. Try another search.";
    }
  } catch (error) {
    resultCount.textContent =
      "Something went wrong. Please try again.";
    console.error(error);
  }
});
```
