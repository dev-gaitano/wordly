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
        throw new Error("Word not found")
      }
    } catch (err) {
      console.log("Error fetching word: ", err)
      throw err
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
      let partOfSpeech = []
      const definitions = []
      let synonyms = []
      meanings?.forEach(meaning => {
        // Get parts of speech
        partOfSpeech.push(meaning.partOfSpeech)

        // Get definitions
        meaning.definitions.forEach(definition => {
          definitions.push(definition.definition)
        })

        // Get synonyms
        synonyms.push(...meaning.synonyms)
      });

      // Create content display elements
      const content = document.createElement("div")
      content.setAttribute("id", "content-container")

      // Main content
      const mainContent = document.createElement("section")
      mainContent.setAttribute("id", "main-content")
      mainContent.classList.add("card-bg")

      // content title
      const contentTitle = document.createElement("div")
      contentTitle.setAttribute("id", "content-title")

      const wordEl = document.createElement("h2")
      wordEl.innerText = word
      contentTitle.appendChild(wordEl)

      const partOfSpeechEl = document.createElement("p")
      partOfSpeechEl.innerText = partOfSpeech
      contentTitle.appendChild(partOfSpeechEl)

      mainContent.appendChild(contentTitle)

      // phonetics
      const phoneticsDiv = document.createElement("div")
      phoneticsDiv.setAttribute("id", "phonetics-container")

      const phoneticEl = document.createElement("p")
      phoneticEl.innerText = phonetic
      phoneticsDiv.appendChild(phoneticEl)

      const phoneticAudioEl = document.createElement("audio")
      phoneticAudioEl.controls = true
      phoneticsDiv.appendChild(phoneticAudioEl)

      const source = document.createElement("source")
      source.src = phoneticAudio
      source.type = "audio/mpeg"
      phoneticAudioEl.appendChild(source)

      mainContent.appendChild(phoneticsDiv)

      // definitions
      const definitionsDiv = document.createElement("div")
      definitionsDiv.setAttribute("id", "definitions-container")

      definitions.forEach((definition) => {
        const definitionEl = document.createElement("p")
        definitionEl.innerText = definition
        definitionsDiv.appendChild(definitionEl)
      })

      mainContent.appendChild(definitionsDiv)

      content.appendChild(mainContent)


      // Secondary content
      const secondaryContent = document.createElement("section")
      secondaryContent.setAttribute("id", "secondary-content")

      // synonyms
      const synonymsDiv = document.createElement("div")
      synonymsDiv.setAttribute("id", "synonyms-container")
      synonymsDiv.classList.add("card-bg")

      const synonymsTitle = document.createElement("h3")
      synonymsTitle.innerText = "Synonyms"
      synonymsDiv.appendChild(synonymsTitle)

      synonyms.forEach((synonym) => {
        const synonymsEl = document.createElement("p")
        synonymsEl.innerText = synonym
        synonymsDiv.appendChild(synonymsEl)
      })

      secondaryContent.appendChild(synonymsDiv)

      // saved words
      const savedDiv = document.createElement("div")
      savedDiv.setAttribute("id", "saved-container")
      savedDiv.classList.add("card-bg")

      const savedTitle = document.createElement("h3")
      savedTitle.innerText = "Saved words"
      savedDiv.appendChild(savedTitle)

      secondaryContent.appendChild(savedDiv)

      content.appendChild(secondaryContent)


      displayArea.appendChild(content)
    })
  }

  // Handle inputs and events
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault()

    const word = searchInput.value.trim()
    if (!word) return

    displayArea.innerHTML = ""
    displayArea.classList.remove("hidden")

    try {
      const data = await fetchWordData(word)
      searchBtn.classList.add("success")
      displayData(data)

      setTimeout(() => searchBtn.classList.remove("success"), 1000)
    } catch (err) {
      searchBtn.classList.add("info")
      setTimeout(() => searchBtn.classList.remove("info"), 1000)

      const errorMsg = document.createElement("div")
      errorMsg.classList.add("card-bg")
      errorMsg.style.textAlign = "center"
      errorMsg.innerHTML = `<h3>Oops! Word not found</h3><p>Try searching for another word.</p>`
      displayArea.appendChild(errorMsg)
    }
  })
})
