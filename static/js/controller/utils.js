export let utils = { 
     createNewButton: function (identifier, text) {
        let button = document.createElement("button");
                button.setAttribute("id", identifier);
                button.innerHTML = text
        return button
    },
    setModalAndGetForm: function (text) {
        let modal = document.getElementById("modal")
        let span = modal.querySelector(".close")
        let formButton = modal.querySelector("button")

        let form = formButton.parentElement
        let label = form.querySelector("label")
        label.innerHTML = text

        let input = form.querySelector("input")
        input.value = ""

        modal.style.display = "block";
        
        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }

        return form
    },
}