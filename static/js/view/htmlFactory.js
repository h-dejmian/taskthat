export const htmlTemplates = {
    board: 1,
    card: 2,
    status: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.status]: statusBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board" data-board-id="${board.id}">
                    <span class="delete" data-board-id="${board.id}">&times;</span>
                    <h3 data-board-id="${board.id}">${board.title}</h3>
                    <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                </div>
                
            </div> </br>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" draggable=true><span class="title">${card.title}</span> <span class="delete">&times;</span></div>`;
}

function statusBuilder(status) {
    return `<div class="status" status-id=${status.id}> <span class="title"> ${status.title}</span> <span class="delete">&times;</span>   </div>`
}

