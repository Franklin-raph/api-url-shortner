const userInput = document.querySelector("input[type='text']");
const validUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

async function getLink() {
  document.querySelector(".fa-circle-notch").style.display = "block";
  document.querySelector(".input-button h4").style.display = "none";
  // shortenItText.style.display = "none"
  // loading.style.display = "block"
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${userInput.value}`);
  const data = await res.json();

  if (res) {
    document.querySelector(".input-button h4").style.display = "block";
    document.querySelector(".fa-circle-notch").style.display = "none";
  }

  // if(res.ok){
  //     userInput.value = ""
  // }

  if (data) {
    // shortenItText.style.display = "block"
    // loading.style.display = "none"
  }
  console.log(data);
  return data;
}

const linksArray = JSON.parse(localStorage.getItem("links")) || []



document.querySelector("button").addEventListener("click", async () => {
  console.log(userInput.value);
  if (userInput.value.length === 0) {
    userInput.classList.add("placeHolderError");
    userInput.classList.add("borderError");
    document.querySelector(".error").textContent = "Field can't be left empty";
    return;
  } else if (!userInput.value.match(validUrl)) {
    console.log("false");
    userInput.style.color = "hsl(0, 87%, 67%);";
    userInput.classList.add("borderError");
    document.querySelector(".error").textContent = "Invalid URL";
  } else {
    document.querySelector(".fa-circle-notch").style.display = "inlineBlock";
    userInput.classList.remove("borderError");
    document.querySelector(".error").textContent = "";
    const url = await getLink();

    let linkObject = {
        longLink:userInput.value,
        shortLink:url.result.short_link,
        id:Date.now(),
    }

    linksArray.push(linkObject)
    localStorage.setItem("links", JSON.stringify(linksArray))

    document.querySelector(".link-container").innerHTML += `
            <div class="url-text-div">
                <div>
                    <p class="long-url">${userInput.value}</p>
                    <div>
                        <p class="shortLink">${url.result.short_link}</p>
                        <div class="actions">
                            <a href=https://${url.result.short_link} target="_blank" id="linkId">
                                <i class="ri-external-link-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    if (url) {
      userInput.value = "";
    }
}
});

function outPutLinks(){
    if(!linksArray){
        return
    }else{
        linksArray.reverse().forEach((link) => {
            const urlDiv = document.createElement("div")
            urlDiv.classList.add("url-text-div")
            urlDiv.innerHTML += `
                <div>
                    <p class="long-url">${link.longLink}</p>
                    <div>
                        <p class="shortLink">${link.shortLink}</p>
                        <div class="actions">
                            <i class="ri-eye-fill" onclick="viewLink(${link.id})"></i>
                            <a href=https://${link.shortLink} target="_blank" id="linkId">
                                <i class="ri-external-link-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        document.querySelector(".link-container").appendChild(urlDiv)
        })
    }
}

outPutLinks()
const shortLink = document.querySelector(".short-link")

function viewLink(id){
    document.querySelector(".linkModalBg").style.display = "flex"
    let linkDetails = linksArray.find(note => note.id === id);
    document.querySelector(".long-link").textContent = linkDetails.longLink.slice(0, 10)
    shortLink.textContent = linkDetails.shortLink
    qrImageSrc.src = `https://api.qrserver.com/v1/create-qr-code/?data=${shortLink.textContent}&amp;size=100x100`
}

const copiedMessage = document.querySelector(".copiedMessage")
const copyIcon = document.querySelector(".ri-clipboard-fill")
const qrImageSrc = document.querySelector(".qrCodeGenerator img")
const qrCodeModal = document.querySelector(".qrCodeGenerator")

copyIcon.addEventListener("click", ()=>{
    navigator.clipboard.writeText(shortLink.textContent)
    copiedMessage.style.display = "flex"
    copyIcon.style.display = "none"
    
    setTimeout(()=>{
      copyIcon.style.display = "block"
      copiedMessage.style.display = "none"
    },3000)
})

document.querySelector(".ri-qr-code-line").addEventListener("click", () => {
  qrCodeModal.style.display = "flex";
});

document.querySelector(".qrCodeGenerator i").addEventListener("click", ()=>{
  qrCodeModal.style.display = "none";
})

const gitHubIcon = document.querySelector(".ri-github-fill");
const phoneIcon = document.querySelector(".ri-mail-fill");

document.querySelector(".logo").addEventListener("mouseover", function () {
  gitHubIcon.style.right = "10%";
  gitHubIcon.style.transition = ".8s";
  gitHubIcon.style.width = "40%";
});

document.querySelector(".logo").addEventListener("mouseout", function () {
  gitHubIcon.style.right = "50%";
  gitHubIcon.style.transition = ".8s";
  gitHubIcon.style.width = "0";
});

document.querySelector(".logo").addEventListener("mouseover", function () {
  phoneIcon.style.left = "8%";
  phoneIcon.style.transition = ".8s";
  phoneIcon.style.width = "40%";
});

document.querySelector(".logo").addEventListener("mouseout", function () {
  phoneIcon.style.left = "50%";
  phoneIcon.style.transition = ".8s";
  phoneIcon.style.width = "0";
});

document.querySelector(".ri-arrow-down-s-fill").addEventListener("click", () => {
  document.querySelector(".link-container").classList.toggle("showlinks");
});

document.querySelector(".ri-close-circle-fill").addEventListener("click", ()=>{
  document.querySelector(".linkModalBg").style.display = "none"
})