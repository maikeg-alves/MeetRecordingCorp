const WELCOME_SCREEN = "div.jtn8y";
const HOME_MEET = "#yDmH0d > c-wiz > div > div.S3RDod > div";
const RECORDING_ALERT = "div.i67Akf.o2vY1c > div";

const RECORDING_PANEL_SELECTOR = 'div[jscontroller="ZUdl0b"]';
const VIEW_OPTIONS_SELECTOR = 'button[aria-label="Mais opções"]';
const MANAGE_RECORDING_SELECTOR =
     "ul > li.V4jiNc.NticYc.VfPpkd-StrnGf-rymPhb-ibnC6b";
const LANGUAGE_LIST_SELECTOR = 'ul > li > span [jsname="K4r5Ff"]';
const START_RECORD_BUTTON_SELECTOR = 'button[aria-label="Começar a gravar"]';
const POPUP_SELECTOR =
     "div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.Qb2h6b.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c";
const START_BUTTON_SELECTOR = 'button[data-mdc-dialog-action="A9Emjd"]';
const STOP_BUTTON_SELECTOR = 'button[aria-label="Parar gravação"]';
const CLOSE_BUTTON = 'button[aria-label="Fechar"]';

const popupHtml = `
<div class="container" >
<div id="my-popup" class="popup">
<p> Lembre-se de avisar os demais participantes da reunião que ela será gravada e armazenada. Você confirma que deseja iniciar a gravação?"</p>
<div class="row">
<button id="confirm-recording">Confirmar</button>
    <button id="close-popup">Cancelar</button>
  </div>
</div>
<div class="backgroud"></div>
</div>
  `;

const popup = document.createElement("div");
popup.innerHTML = popupHtml;
document.body.appendChild(popup);
const popupElement = document.querySelector("body > div:nth-child(3) > div");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
     if (request.action === "showRecordingAlert") {
          chrome.notifications.create({
               type: "basic",
               iconUrl: "./icon.png",
               title: "Recording Alert",
               message: "This call will be automatically recorded.",
          });
     }
});

window.addEventListener("load", function () {
     startScript();
});

async function startScript() {
     let welcomeScreen = await waitForElement(WELCOME_SCREEN);

     while (!!welcomeScreen) {
          await delay(2000); // Espera 5 segundos antes de verificar novamente
          welcomeScreen = document.querySelector(WELCOME_SCREEN);
     }

     await delay(2000);

     const recordingAlert = document.querySelector(RECORDING_ALERT);

     if (recordingAlert) {
          return;
     }

     popupElement.style.display = "flex";
     const confirmButton = popupElement.querySelector("#confirm-recording");
     confirmButton.addEventListener("click", () => {
          alert("run script");
          popupElement.style.display = "none";
          startRecording()
     });

     const cancelButton = popupElement.querySelector("#close-popup");
     cancelButton.addEventListener("click", () => {
          popupElement.style.display = "none";
          return;
     });
}

// Crie uma função para aguardar um determinado período de tempo
async function delay(ms) {
     return new Promise((resolve) => {
          setTimeout(resolve, ms);
     });
}

// Crie uma função para aguardar a exibição de um elemento na página
function waitForElement(selector) {
     return new Promise((resolve) => {
          const element = document.querySelector(selector);
          if (element) {
               resolve(element);
          } else {
               const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                         observer.disconnect();
                         resolve(element);
                    }
               });
               observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
               });
          }
     });
}

// Crie uma função para iniciar a gravação
async function startRecording() {
     await delay(100);

     document.body.style.pointerEvents = "none";

     const recordingPanel = await waitForElement(RECORDING_PANEL_SELECTOR);

     const viewOptions = await waitForElement(VIEW_OPTIONS_SELECTOR);
     viewOptions.click();
     await delay(100);

     const manageRecordingButton = await waitForElement(MANAGE_RECORDING_SELECTOR);
     manageRecordingButton.click();

     await delay(1000)

     const languageList = recordingPanel.querySelectorAll(LANGUAGE_LIST_SELECTOR)[
          recordingPanel.querySelectorAll(LANGUAGE_LIST_SELECTOR).length - 2
     ];


     if (languageList) {
          await delay(300);
          languageList.click();
          await delay(100);
          const startRecordButton = recordingPanel.querySelector(
               START_RECORD_BUTTON_SELECTOR
          );

          if (startRecordButton) {
               startRecordButton.click();
               await delay(100);

               const popup = document.querySelector(POPUP_SELECTOR);
               if (popup) {
                    const startButton = popup.querySelector(START_BUTTON_SELECTOR);
                    if (startButton) {
                         startButton.click();
                         document.body.style.pointerEvents = "auto";
                         await delay(100);
                         recordingPanel.querySelector(CLOSE_BUTTON).click();
                    }
               }
          }
     }
}

