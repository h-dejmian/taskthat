import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, newCardButtonHandler, addSampleCard} from "./cardsManager.js";
import {utils} from "./utils.js";
import { statusManager, addListenersToStatus } from "./statusesManager.js";

export let boardsManager = {
    loadBoards: async function () {
        let root = document.querySelector("#root")
        if(root != null) {removeBoardsFromView();}

        const boards = await dataHandler.getBoards();
        
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            
            let board_element = document.querySelector(`.board[data-board-id="${board.id}"]`)

            let header = board_element.querySelector('h3')
            header.addEventListener('click', boardTitleClickHandler)

            let spanElement = board_element.querySelector(".delete")
            spanElement.addEventListener("click", deleteBoardButtonHandler)
        
        }
        domManager.addEventListener('#new-board-button', 'click', newBoardButtonHandler )
    },
};


function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let board = document.querySelector(`[data-board-id="${boardId}"]`);
    let showHidebutton = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);

    if(board.contains(board.querySelector('.status'))) {
        showHidebutton.innerHTML = "Show Cards"

        let status = board.querySelectorAll(".status")
        status.forEach(status => {status.remove()})
        
        let cardButton = board.querySelector("#new-card-button")
        board.removeChild(cardButton)

        let statusButton = board.querySelector("#new-status-button")
        board.removeChild(statusButton)

        let br = board.querySelector("br")
        board.removeChild(br)
        return
    }
    else {

        if(!board.contains(board.querySelector('#new-card-button'))) {
            let newCardButton = utils.createNewButton( "new-card-button", "Create New Card")
            newCardButton.addEventListener("click", newCardButtonHandler)
            
            let newStatusButton = utils.createNewButton( "new-status-button", "Create New Status")
            newStatusButton.addEventListener("click", statusManager.newStatusButtonHandler)

            board.appendChild(newCardButton);
            board.appendChild(newStatusButton);

            cardsManager.loadCards(boardId);
            
            let br = document.createElement("br")
            board.appendChild(br)
        }
        showHidebutton.innerHTML = "Hide Cards";
    }
    showHidebutton.innerHTML = "Hide Cards";
}

function newBoardButtonHandler() {

    let form = utils.setModalAndGetForm("New Board Title")

    form.addEventListener("submit", async function handler(e) {
        e.preventDefault()
        let input = form.querySelector("input")
        input = form.querySelector("input")
        let title = input.value
        
        let board = await dataHandler.createNewBoard(title)
        let boardBuilder = htmlFactory(htmlTemplates.board)
        const boardContent = boardBuilder(board)
        domManager.addChild("#root", boardContent)

        modal.style.display = "none";
        form.removeEventListener("submit", handler)

        domManager.addEventListener(
            `.toggle-board-button[data-board-id="${board.id}"]`,
            "click",
            showHideButtonHandler
        );
        domManager.addEventListener(
            `.delete[data-board-id="${board.id}"]`,
            "click",
            deleteBoardButtonHandler
        );
        domManager.addEventListener(
            `h3[data-board-id="${board.id}"]`,
            "click",
            boardTitleClickHandler
        );

        let boardElement = document.querySelector(`.board[data-board-id="${board.id}"]`)

        if( window.confirm("Do you want to create default columns?")) {
            addDefaultStatuses(boardElement)
        }
    })
}

function boardTitleClickHandler(clickEvent) {

    let form = utils.setModalAndGetForm("New Board Title")

    let header = clickEvent.target;
    let board = clickEvent.target.parentElement
    const boardId = board.getAttribute("data-board-id")
    
    form.addEventListener("submit", async function handler(e) {
        e.preventDefault()
        let input = form.querySelector("input")
        let title = input.value
        
        board = await dataHandler.editBoardTitle(title, boardId)
        header.innerHTML = title

        modal.style.display = "none";
        form.removeEventListener("submit", handler)

        domManager.addEventListener(
            `.toggle-board-button[data-board-id="${boardId}"]`,
            "click",
            showHideButtonHandler
        );
    })
}

function deleteBoardButtonHandler(clickEvent) {
    if( !window.confirm("Are you sure you want to delete this board?")) {
        return
    }
    let boardElement = clickEvent.target.parentElement
    const boardId = boardElement.getAttribute("data-board-id")

    dataHandler.deleteBoard(boardId)

    boardElement.parentElement.remove()
}

function removeBoardsFromView(){
    let boards = document.querySelectorAll(".board-container")
    boards.forEach(board => {board.remove()})
}

async function addDefaultStatuses(board) {
    const status_titles = ["New", "In Progress", "Testing", "Done" ]
    const boardId = board.getAttribute("data-board-id")
    
    for(let i=0; i < status_titles.length; i++) {
        let status = await dataHandler.createNewStatus(status_titles[i]);
        addSampleCard(boardId, status.id, 1)
    }
}



