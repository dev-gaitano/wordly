document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn")
  const searchInput = document.getElementById("search-input")
  const displayArea = document.getElementById("display-area")

  // fetch word data
  async function fetchWordData(word) {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

      // Check if response is ok
      if (res.ok) {
        const wordData = await res.json()
        return wordData
      } else {
        console.error('Failed to fetch word data');
        console.log(res)
      }
    } catch (err) {
      console.log("Error fetching word: ", err)
    }
  }

  // Display data
  function displayData(data) {
    data.forEach(obj => {
      const word = obj.word

      // Pronunciations
      const phonetic = obj.phonetic
      const phonetics = obj.phonetics
      let phoneticAudio = phonetics[0]?.audio || ""

      // Definitions & synonyms
      const meanings = obj.meanings
      let partOfSpeech = meanings[0]?.partOfSpeech || ""
      const definitions = []
      let synonyms = []
      meanings.forEach(meaning => {
        // Get definitions
        meaning.definitions.forEach(definition => {
          definitions.push(definition.definition)
        })

        // Get synonyms
        synonyms.push(...meaning.synonyms)
      });

      // Create display elements
      const wordEl = document.createElement("h2")
      wordEl.innerText = word

      const phoneticEl = document.createElement("p")
      phoneticEl.innerText = phonetic

      const phoneticAudioEl = document.createElement("p")
      phoneticAudioEl.innerText = phoneticAudio

      const partOfSpeechEl = document.createElement("p")
      partOfSpeechEl.innerText = partOfSpeech

      displayArea.appendChild(wordEl)
      displayArea.appendChild(phoneticEl)
      displayArea.appendChild(phoneticAudioEl)
      displayArea.appendChild(partOfSpeechEl)

      definitions.forEach((definition) => {
        const definitionEl = document.createElement("p")
        definitionEl.innerText = definition
        displayArea.appendChild(definitionEl)
      })

      synonyms.forEach((synonym) => {
        const synonymsEl = document.createElement("p")
        synonymsEl.innerText = synonym
        displayArea.appendChild(synonymsEl)
      })
    })
  }

  // Handle inputs and events
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault()

    // Search functionality
    const word = searchInput.value
    const data = await fetchWordData(word)
    searchInput.value = ""

    // Display
    displayArea.innerHTML = ""
    displayData(data)
  })
})
