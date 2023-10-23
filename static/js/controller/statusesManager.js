import  {dataHandler} from "../data/dataHandler.js";
import { domManager } from "../view/domManager.js";
import {boardsManager} from "./boardsManager.js";
import { cardsManager, dragAndDropElements } from "./cardsManager.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import { utils } from "./utils.js";

export let statusManager = {
    loadStatuses: async function() {
        const statuses = dataHandler.getStatuses();
        
    },
    addStatusToBoard: function(board, status) {
        board.addChild(status)
    },
    newStatusButtonHandler: function(clickEvent) {

        let form = utils.setModalAndGetForm("New Status Title")
    
        form.addEventListener("submit", async function handler(e) {
            e.preventDefault()
            let input = form.querySelector("input")
            let title = input.value
            let board = clickEvent.target.parentElement
            const boardId = board.getAttribute("data-board-id")
    
            modal.style.display = "none";

            let newStatus = await dataHandler.createNewStatus(title)
            const statusBuilder = htmlFactory(htmlTemplates.status);
            const statusContent = statusBuilder(newStatus);

            domManager.addChild(`.board[data-board-id="${boardId}"]`, statusContent)

            let statusElement = board.querySelector(`.status[status-id="${newStatus.id}"]`)
            addListenersToStatus(statusElement)

            initDropZone(statusElement)
           
            form.removeEventListener("submit", handler)
        })
    },
}

function titleEditHandler (clickEvent) {

    let form = utils.setModalAndGetForm("New Status Title")

    let status = clickEvent.target.parentElement
    let board = status.parentElement

    form.addEventListener("submit", async function handler(clickEvent) {
        clickEvent.preventDefault()
        
        let input = form.querySelector("input")
        let title = input.value
        let statusId = status.getAttribute('status-id')
        
        await dataHandler.editStatusTitle(title, statusId)

        let statusElement = board.querySelector(`.status[status-id="${statusId}"]`)
        let spanElement = statusElement.querySelector(".title")
        spanElement.innerHTML = title

        modal.style.display = "none";
        form.removeEventListener("submit", handler)
    })
}

function deleteStatusButtonHandler(clickEvent) {
    if( !window.confirm("Are you sure you want to delete this status?")) {
        return
    }
    let statusElement = clickEvent.target.parentElement
    const statusId = statusElement.getAttribute("status-id")

    dataHandler.deleteStatus(statusId)

    clickEvent.target.parentElement.remove()
}

export function initDropZone(statusElement) {
    statusElement.addEventListener("dragenter", handleDragEnter)
    statusElement.addEventListener("dragover", handleDragOver)
    statusElement.addEventListener("dragleave", handleDragLeave)
    statusElement.addEventListener("drop", handleDrop)
}

function handleDragEnter(clickEvent) {
}

function handleDragOver(clickEvent) {
    clickEvent.preventDefault()
}

function handleDragLeave(clickEvent) {
//    clickEvent.target.removeChild(dragAndDropElements.dragged)
}

async function handleDrop(clickEvent) {
    if(clickEvent.target.getAttribute("class") == "card") {
        swapCardsOrder(dragAndDropElements.dragged, clickEvent.target)

        dragAndDropElements.dragged.parentElement.insertBefore(dragAndDropElements.dragged, clickEvent.target)
        return
    }
    const cardId = dragAndDropElements.dragged.getAttribute("data-card-id")
    const statusId = clickEvent.target.getAttribute("status-id")
    await dataHandler.editCardStatus(cardId, statusId)

    clickEvent.target.appendChild(dragAndDropElements.dragged)
}

export function addListenersToStatus(status) {
    let spanElementTitle = status.querySelector(".title")
    spanElementTitle.addEventListener("click", titleEditHandler)

    let spanElementDelete = status.querySelector(".delete")
    spanElementDelete.addEventListener("click", deleteStatusButtonHandler)
}

async function swapCardsOrder(cardElement1, cardElement2) {
    let card1 = await dataHandler.getCard(cardElement1.getAttribute("data-card-id"))
    let card2 = await dataHandler.getCard(cardElement2.getAttribute("data-card-id"))

    console.log(card2[0].card_order )

    let a = await dataHandler.editCardOrder(card1[0].id, card2[0].card_order)
    await dataHandler.editCardOrder(card2[0].id, card1[0].card_order)
}