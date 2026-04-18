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
      let antonyms = []
      meanings?.forEach(meaning => {
        // Get parts of speech
        partOfSpeech.push(meaning.partOfSpeech)

        // Get definitions
        meaning.definitions.forEach(definition => {
          definitions.push(definition.definition)
        })

        // Get synonyms
        synonyms.push(...meaning.synonyms)

        // Get antonyms
        antonyms.push(...meaning.antonyms)
      });

      // Create content display elements
      const content = document.createElement("div")
      content.setAttribute("id", "content-container")

      // Main content
      const mainContent = document.createElement("section")
      mainContent.setAttribute("id", "main-content")
      mainContent.classList.add("card-bg", "fade-el")
      setTimeout(() => {
        mainContent.classList.add("show")
      }, 10)

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
      synonymsDiv.classList.add("card-bg", "fade-el")
      setTimeout(() => {
        synonymsDiv.classList.add("show")
      }, 40)

      const synonymsTitle = document.createElement("h3")
      synonymsTitle.innerText = "Synonyms"
      synonymsDiv.appendChild(synonymsTitle)

      if (synonyms.length === 0) {
        const noSynonymsEl = document.createElement("p")
        noSynonymsEl.innerText = "No synonyms..."
        synonymsDiv.appendChild(noSynonymsEl)
      } else {
        synonyms.forEach((synonym) => {
          const synonymsEl = document.createElement("p")
          synonymsEl.innerText = synonym
          synonymsDiv.appendChild(synonymsEl)
        })
      }

      secondaryContent.appendChild(synonymsDiv)

      // antonyms
      const antonymsDiv = document.createElement("div")
      antonymsDiv.setAttribute("id", "antonyms-container")
      antonymsDiv.classList.add("card-bg", "fade-el")
      setTimeout(() => {
        antonymsDiv.classList.add("show")
      }, 70)

      const antonymsTitle = document.createElement("h3")
      antonymsTitle.innerText = "Antonyms"
      antonymsDiv.appendChild(antonymsTitle)

      if (antonyms.length === 0) {
        const noAntonymsEl = document.createElement("p")
        noAntonymsEl.innerText = "No antonyms..."
        antonymsDiv.appendChild(noAntonymsEl)
      } else {
        antonyms.forEach((antonym) => {
          const antonymsEl = document.createElement("p")
          antonymsEl.innerText = antonym
          antonymsDiv.appendChild(antonymsEl)
        })
      }

      secondaryContent.appendChild(antonymsDiv)

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

      // Display
      displayData(data)

      setTimeout(() => searchBtn.classList.remove("success"), 1000)
    } catch (err) {
      searchBtn.classList.add("info")
      setTimeout(() => searchBtn.classList.remove("info"), 1000)
      const infoMsg = document.createElement("div")
      infoMsg.classList.add("message", "info", "card-bg", "fade-el")
      infoMsg.innerHTML = `<h3>Oops! Word not found</h3><p>Try searching for another word</p>`
      setTimeout(() => {
        infoMsg.classList.add("show")
      }, 40)
      displayArea.appendChild(infoMsg)
    }
  })
})
