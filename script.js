console.log("JavaScript is connected!");

const form = document.getElementById("battle-form")

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const first = document.getElementById("first").value.trim().toLowerCase();
    const second = document.getElementById("second").value.trim().toLowerCase();

    const message = document.getElementById("message");

    if (first == "" || second == "") {
        message.textContent = "Enter two Pokemon names.";
        return;
    }

    if (first == second) {
        message.textContent = "Chose two different Pokemon.";
        return;
    }

    message.textContent = "";

    document.getElementById("first").value = "";
    document.getElementById("second").value = "";

    try {

        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + first);
        console.log("Status:", response.status)

        if (!response.ok) {
            message.textContent = ("Couldn't find " + first + ".");
            return;
        }

        const firstPokemon = await response.json();
        console.log(firstPokemon);

        const secondResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + second);
        console.log("Status: ", secondResponse.status);

        if (!secondResponse.ok) {
            message.textContent = ("Couldn't find " + second + ".");
            return;
        }

        const secondPokemon = await secondResponse.json();
        console.log(secondPokemon)

        let firstTotal = 0;

        for (const stat of firstPokemon.stats) {
            firstTotal = firstTotal + stat.base_stat;
        }

        let secondTotal = 0;

        for (const stat of secondPokemon.stats) {
            secondTotal = secondTotal + stat.base_stat;
        }

        console.log(firstTotal, secondTotal)

        let result;

        if (firstTotal > secondTotal) {
            result = firstPokemon.name + " wins!";
        } else if (secondTotal > firstTotal) {
            result = secondPokemon.name + " wins!";
        } else { 
            result = "It's a tie!";
        }

        console.log(result);

        const battleLog = document.getElementById("battle-log");

        const battle = document.createElement("div");

        battle.classList.add("battle");

        const heading = document.createElement("h2");

        heading.textContent = result;

        battle.appendChild(heading);

        const firstName = document.createElement("h3");
        firstName.textContent = firstPokemon.name;

        const firstImage = document.createElement("img");
        firstImage.setAttribute("src", firstPokemon.sprites.front_default);
        firstImage.setAttribute("alt", firstPokemon.name);

        battle.appendChild(firstName);
        battle.appendChild(firstImage);

        const firstDetails = document.createElement("p");

        const firstTypes = firstPokemon.types.map(function(entry) {
            return entry.type.name;
        });

        firstDetails.textContent = firstTypes.join(", ") + " | Total Stats: " + firstTotal;

        battle.appendChild(firstDetails);

        const secondName = document.createElement("h3");
        secondName.textContent = secondPokemon.name;

        const secondImage = document.createElement("img");
        secondImage.setAttribute("src", secondPokemon.sprites.front_default);
        secondImage.setAttribute("alt", secondPokemon.name);

        const secondDetails = document.createElement("p");

        const secondTypes = secondPokemon.types.map(function(entry) {
            return entry.type.name;
        });

        secondDetails.textContent = secondTypes.join(", ") + " | Total Stats: " + secondTotal;

        battle.appendChild(secondName);
        battle.appendChild(secondImage);
        battle.appendChild(secondDetails);

        if (firstTotal > secondTotal){
            firstName.style.color = "green";
        } else if (secondTotal > firstTotal) {
            secondName.style.color = "green";
        }
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute("type","button");

        removeButton.addEventListener("click",function(){
            battle.remove();
            document.getElementById("count").textContent = battleLog.children.length + " battles.";
        });

        battle.appendChild(removeButton)

        battleLog.appendChild(battle);

        const count = document.getElementById("count");
        count.textContent = battleLog.children.length + " battles";

    } catch (error) {
        message.textContent = "PokeAPI couldn't be reached.";
        console.error(error)
    }

const clearButton = document.getElementById("clear-all");

clearButton.addEventListener("click", function() {
    document.getElementById("battle-log").replaceChildren();
    document.getElementById("message").textContent = "";
    document.getElementById("count").textContent = " 0 battles.";
});


});