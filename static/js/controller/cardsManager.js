import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {boardsManager} from "./boardsManager.js";
import { statusManager, initDropZone, addListenersToStatus } from "./statusesManager.js";
import { utils } from "./utils.js";

export const dragAndDropElements = {
    dragged : null
}

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        const statuses = await dataHandler.getStatuses();
        
        let board = document.querySelector(`.board[data-board-id="${boardId}"]`);

        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const card_content = cardBuilder(card);

            let status = getCardStatus(card, statuses)
            const statusBuilder = htmlFactory(htmlTemplates.status)
            const statusContent = statusBuilder(status)
            
            let statusElement = board.querySelector(`.status[status-id="${status.id}"]`)
            let isStatusPresent = statusElement != null ? true : false;

            if(!isStatusPresent) {
                domManager.addChild(`.board[data-board-id="${boardId}"]`, statusContent)
                statusElement = board.querySelector(`.status[status-id="${status.id}"]`)
                statusElement.insertAdjacentHTML("beforeend", card_content)
            }
            else {
                statusElement.insertAdjacentHTML("beforeend", card_content)
            }
            
            addListenersToStatus(statusElement)

            let cardElement = document.querySelector(`.card[data-card-id="${card.id}"]`)

            initDropZone(statusElement);
            initDraggable(cardElement);

            addListenersToCard(cardElement)
        }
    },
};

function deleteCardButtonHandler(clickEvent) {
    if( !window.confirm("Are you sure you want to delete this card?")) {
        return
    }
    let cardElement = clickEvent.target.parentElement
    const cardId = cardElement.getAttribute("data-card-id")

    dataHandler.deleteCard(cardId)

    clickEvent.target.parentElement.remove()
}

function cardTitleClickHandler(clickEvent) {

        let form = utils.setModalAndGetForm("New Card Title")
        let cardElement = clickEvent.target.parentElement
        
        form.addEventListener("submit", async function handler(clickEvent) {
            clickEvent.preventDefault()

            let cardId = cardElement.getAttribute('data-card-id')
            
            let input = form.querySelector("input")
            let title = input.value
            
            await dataHandler.editCardTitle(title, cardId)
    
            let spanElement = cardElement.querySelector(".title")
            spanElement.innerHTML = title
    
            modal.style.display = "none";
            form.removeEventListener("submit", handler)
        })
    
}

export function newCardButtonHandler(clickEvent) {
    
    let form = utils.setModalAndGetForm("New Board Title")

    form.addEventListener("submit", async function handler(e) {
        e.preventDefault()
        let input = form.querySelector("input")
        let title = input.value
        let board = clickEvent.target.parentElement
        const boardId = board.getAttribute("data-board-id")

        let statusElement = board.querySelector(".status")
        let isStatusPresent = statusElement != null ? true : false;
        let newCard = null

        if(isStatusPresent) {
            const statusId = statusElement.getAttribute("status-id")
            let card_order = await dataHandler.getNumberOfCardsByStatus(statusId)

            newCard = await dataHandler.createNewCard(title, boardId, statusId, ++card_order)

            const cardBuilder = htmlFactory(htmlTemplates.card)
            let cardContent = cardBuilder(newCard)
    
            statusElement.insertAdjacentHTML("beforeend", cardContent)
        }
        else {
            let status = await dataHandler.createNewStatus("New");
            newCard = await dataHandler.createNewCard(title, boardId, status.id, 1)
            
            const cardBuilder = htmlFactory(htmlTemplates.card)
            let cardContent = cardBuilder(newCard)

            const statusBuilder = htmlFactory(htmlTemplates.status)
            let statusContent = statusBuilder(status)

            domManager.addChild(`.board[data-board-id="${boardId}"]`, statusContent)
            
            statusElement = board.querySelector(".status")
            statusElement.insertAdjacentHTML("beforeend", cardContent)
            addListenersToStatus(statusElement)
        }
        let modal = document.getElementById("modal")
        modal.style.display = "none";

        let cardElement = board.querySelector(`.card[data-card-id="${newCard.id}"]`)

        addListenersToCard(cardElement)
        initDraggable(cardElement);

        form.removeEventListener("submit", handler)
    })
}

function getCardStatus(card, statuses) {
    
    for(let status of statuses) {
       if(card["status_id"] == status.id)
        return status
    }
    return "No status with matching id card"
}

function addListenersToCard(card) {
    let spanElementTitle = card.querySelector(".title")
    spanElementTitle.addEventListener("click", cardTitleClickHandler)

    let spanElementDelete = card.querySelector(".delete")
    spanElementDelete.addEventListener("click", deleteCardButtonHandler)

    // card.addEventListener("drop", handleCardOnCardDrop)
    
}

function initDraggable(cardElement) {
    cardElement.addEventListener("dragstart", handleCardDragStart)
}

function initCardDropZone(cardElement) {
    cardElement.addEventListener("drop", handleCardOnCardDrop)
    let statusElement = cardElement.parentElement

    statusElement.insertBefore(cardElement, dragAndDropElements.dragged)
}

function handleCardDragStart(clickEvent) {
    dragAndDropElements.dragged = clickEvent.target
}

function handleCardOnCardDrop(clickEvent) {

}

export async function addSampleCard(boardId, statusId, card_order) {
    await dataHandler.createNewCard("Sample card", boardId, statusId, card_order)
}

