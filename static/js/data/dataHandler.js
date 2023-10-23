export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet(`/api/boards/statuses/`);
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
        return await apiGet(`/api/boards/statuses/${statusId}`);
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
        return await apiGet(`/api/boards/cards/${cardId}`);
    },
    getNumberOfCardsByStatus: async function (statusId) {
        // the card is retrieved and then the callback function is called with the card
        return await apiGet(`/api/${statusId}`);
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        return await apiPost(`/api/boards`, boardTitle);
    },
    createNewCard: async function (cardTitle, boardId, statusId, card_order) {
        // creates new card, saves it and calls the callback function with its data
        let card = {"title": cardTitle, "board_id": boardId, "status_id": statusId, "card_order": card_order}
        return await apiPost(`/api/boards/card`, card);
    },
    createNewStatus: async function (statusTitle) {
        // creates new card, saves it and calls the callback function with its data
        return await apiPost(`/api/statuses`, statusTitle);
    },
    editBoardTitle: async function (title, id) {
        return await apiPatch(`/api/boards/${id}`, title);
    },
    editStatusTitle: async function (title, id) {
        return await apiPatch(`/api/statuses/${id}`, title);
    },
    editCardTitle: async function (title, cardId) {
        return await apiPatch(`/api/boards/cards/${cardId}`, title);
    },
    editCardStatus: async function (cardId, statusId) {
        return await apiPatch(`/api/boards/statuses/${cardId}`, statusId);
    },
    editCardOrder: async function (cardId, card_order) {
        return await apiPatch(`/api/boards/s/${cardId}`, card_order);
    },
    deleteCard: async function (cardId) {
        return await apiDelete(`/api/boards/cards/${cardId}`);
    },
    deleteStatus: async function (statusId) {
        return await apiDelete(`/api/statuses/${statusId}`);
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/boards/${boardId}`);
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPut(url, payload) {
}

async function apiPatch(url, payload) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        return await response.json();
    }
}
