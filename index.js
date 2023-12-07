function searchFine() {
    let searchFor = document.getElementById("searchbar_input").value.toLocaleLowerCase()
    
    let fines = document.querySelectorAll(".fine");
    for (var i = 0; i < fines.length; i++) {
        if (fines[i].querySelectorAll(".fineText")[0].innerHTML.toLocaleLowerCase().includes(searchFor)) {
            fines[i].classList.add("showing")
            fines[i].classList.remove("hiding")
        } else {
            fines[i].classList.remove("showing")
            fines[i].classList.add("hiding")
        }
        
    }
}

function selectFine(event) {
    let element = event.target
    console.log(element.tagName);
    if (element.tagName == "FONT") return
    if (element.tagName == "TD") element = element.parentElement
    if (element.tagName == "I") element = element.parentElement.parentElement

    if (element.classList.contains("selected")) {
        element.classList.remove("selected")
    } else {
        element.classList.add("selected")
    }

    startCalculating()
}

function startCalculating() {
    let fineResult = document.getElementById("fineResult")
    let fineAmount = 0

    let wantedResult = document.getElementById("wantedsResult")
    let wantedAmount = 0

    let reasonResult = document.getElementById("reasonResult")
    let reasonText = ""
    let plate = document.getElementById("plateInput_input").value
    let systemwanteds = document.getElementById("systemwantedsInput_input").value

    let infoResult = document.getElementById("infoResult")
    let noticeText = ""
    let removeWeaponLicense = false
    let removeDriverLicense = false

    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        fineAmount = fineAmount + parseInt(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount"))
        let extrawanteds_found = fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted")
        for (let b = 0; b < extrawanteds_found.length; b++) {
            if (extrawanteds_found[b].getAttribute("data-addedfine")) fineAmount = fineAmount + parseInt(extrawanteds_found[b].getAttribute("data-addedfine"))
            
        }

        wantedAmount = wantedAmount + parseInt(fineCollection[i].querySelector(".wantedAmount").getAttribute("data-wantedamount"))
        
        wantedAmount = wantedAmount + fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted").length
        if (wantedAmount > 5) wantedAmount = 5
        

        let now = new Date();
        let hour = now.getHours();
        if (hour < 10) hour = "0" + hour

        let minute = now.getMinutes();
        if (minute < 10) minute = "0" + minute

        let day = now.getDate()
        if (day < 10) day = "0" + day

        let month = now.getMonth() + 1
        if (month < 10) month = "0" + month

        let fineText = ""
        if (fineCollection[i].querySelector(".fineText").innerHTML.includes("<i>")) {
            fineText = fineCollection[i].querySelector(".fineText").innerHTML.split("<i>")[0]
        } else {
            fineText = fineCollection[i].querySelector(".fineText").innerHTML
        }

        if (reasonText == "") {
            reasonText = `${day}.${month} ${hour}:${minute} - ${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}`
        } else {
            reasonText += ` + ${day}.${month} ${hour}:${minute} - ${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}`
        }

        if (fineCollection[i].getAttribute("data-removedriverlicence") == "true") removeDriverLicense = true
        if (fineCollection[i].getAttribute("data-removeweaponlicence") == "true") removeWeaponLicense = true
    }

    if (plate != "") {
        reasonText += ` - ${plate.toLocaleUpperCase()}`
    }

    if (systemwanteds != "") {
        reasonText += ` + ${systemwanteds} Systemwanteds`
    }


    if (removeDriverLicense) {
        noticeText = "Führerschein entziehen"
    }
    if (removeWeaponLicense) {
        if (noticeText =="") {
            noticeText = "Waffenschein entziehen"
        } else {
            noticeText = noticeText + " + Waffenschein entziehen"
        }
    }


    infoResult.innerHTML = `<b>Information:</b> ${noticeText}`
    fineResult.innerHTML = `<b>Geldstrafe:</b> <font style="user-select: all;">$${fineAmount}</font>`
    wantedResult.innerHTML = `<b>Wanteds:</b> <font style="user-select: all;">${wantedAmount}</font>`
    reasonResult.innerHTML = `<b>Grund:</b> <font style="user-select: all;" onclick="JavaScript:copyText(event)">${reasonText}</font>`
}



window.onload = () => {
    console.log("onload");
    let savedBody;
    let alreadyBig = true
    savedBody = document.body.innerHTML
    setInterval(() => {
        if (document.body.clientWidth < 750) {
            alreadyBig = false
            document.body.innerHTML = `
            <div style="transform: translate(-50%, -50%); font-weight: 600; font-size: 8vw; color: white; width: 80%; position: relative; left: 50%; top: 50%; text-align: center;">Diese Website kann nur auf einem PC angesehen werden<div>
            `
            document.body.style.backgroundColor = "#121212"
        } else if (alreadyBig == false) {
            alreadyBig = true
            document.body.innerHTML = savedBody;
            document.body.style.backgroundColor = "";
        }
    }, 100)
}

function resetButton() {
    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        fineCollection[i].classList.remove("selected")
    }

    document.getElementById("plateInput_input").value = ""
    document.getElementById("systemwantedsInput_input").value = ""

    startCalculating()
}

function copyText(event) {
    let target = event.target
    // Get the text field
    var copyText = target.innerHTML
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);

    insertNotification("success", "Der Text wurde kopiert.", 5)
}

function toggleExtraWanted(event) {
    let target = event.target
    let extrastarNumber = 0
    let isSelected = false
    let isLead = false

    if(target.classList.contains("extrawanted1")) extrastarNumber = 1
    if(target.classList.contains("extrawanted2")) extrastarNumber = 2
    if(target.classList.contains("extrawanted3")) extrastarNumber = 3
    if(target.classList.contains("extrawanted4")) extrastarNumber = 4
    if(target.classList.contains("extrawanted5")) extrastarNumber = 5


    if (target.classList.contains("selected_extrawanted")) isSelected = true

    if (isSelected && target.parentElement.querySelectorAll(".selected_extrawanted").length == extrastarNumber) isLead = true

    if (isSelected && isLead) {


        let foundEnabled = target.parentElement.querySelectorAll(".selected_extrawanted")
        for (let i = 0; i < foundEnabled.length; i++) {
            foundEnabled[i].classList.remove("selected_extrawanted")
            
        }

        startCalculating()
        return
    }

    if (isSelected) {

        console.log("D");

        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < found.length; i++) {
            console.log(i, extrastarNumber);
            if (i + 1 > extrastarNumber) {

                found[i].classList.remove("selected_extrawanted")
            }
            
        }

        startCalculating()
        return
    }

    if (!isSelected) {
        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < extrastarNumber; i++) {
            found[i].classList.add("selected_extrawanted")
            
        }
    }

    startCalculating()
    //for (let index = 0; index < extrastarNumber; index++) {
    //    const element = array[index];    
    //}
}