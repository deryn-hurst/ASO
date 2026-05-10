// integrating text to speech
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.maxAlternatives = 1;

function getAgentResponse(user_input){
    let xhr = new XMLHttpRequest();
    let url = '/ASO/get_response';
    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        if(this.readyState == 4 && this.status == 200){
            document.getElementById("content").innerHTML += "<br><b>agent</b>: " + this.responseText + "<br>";
            recognition.start();
        }
    }
    xhr.send(JSON.stringify({input: user_input})); 
}

function getSDGEvaluation(transcript){
    let xhr = new XMLHttpRequest();
    let url = '/evaluate_by_sdg';
    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        if(this.readyState == 4 && this.status == 200){
            sessionStorage.setItem("sdg_evaluation", this.responseText);
            getInvestmentEvaluation(transcript);
        }
    }
    xhr.send(JSON.stringify({input: transcript}));
    
}

function getInvestmentEvaluation(transcript){
    let xhr = new XMLHttpRequest();
    let url = '/evaluate_by_investment';
    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function() {
        if(this.readyState == 4 && this.status == 200){
            sessionStorage.setItem("investment_evaluation", this.responseText);
            location.href="evaluation.html";
        }
    }
    xhr.send(JSON.stringify({input: transcript}));
    
}

if(document.title === "ASO - Your All In One Startup Coach"){
    if(sessionStorage.getItem("prev_location") === "evaluation"){
        document.getElementById("content").innerHTML = sessionStorage.getItem("transcript");
    }

    document.getElementById("control_session").addEventListener("click", function () {
        if(document.getElementById("control_session").innerHTML === "stop session"){
            document.getElementById("control_session").innerHTML = "start session";
            recognition.stop();
            // pull transcript
            const transcript = document.getElementById("content").innerHTML;
            sessionStorage.setItem('transcript', transcript);
            // generate reports
            getSDGEvaluation(transcript);
        }
        else {
            document.getElementById("control_session").innerHTML = "stop session";
            recognition.start(); // start listening
            
            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                document.getElementById("current_speech").innerHTML += transcript + ".";
            };

            recognition.onerror = (event) => {
                console.error("Error: ", event.error);
            }

            document.getElementById("confirm_speech").addEventListener("click", function () {
                recognition.stop();
                document.getElementById("content").innerHTML += "<br><b>user</b>: " + document.getElementById("current_speech").innerHTML + "<br>";
                getAgentResponse(document.getElementById("current_speech").innerHTML);
                document.getElementById("current_speech").innerHTML = "";
            });
        }

        // start speaking animation to indicate user input
        var speaking_indication = document.getElementsByClassName("bar");

        var i;
        for(i = 0; i < speaking_indication.length; i++){
            speaking_indication[i].classList.toggle("bar_speaking");
        }
    });
}

if(document.title === "ASO - Startup Evaluation"){
    document.getElementById("sdg").innerHTML = sessionStorage.getItem("sdg_evaluation");

    document.getElementById("investment").innerHTML = sessionStorage.getItem("investment_evaluation");

    document.getElementById("download_transcript").addEventListener('click', function () {
        // pull and clean transcript
        let transcript = sessionStorage.getItem("transcript");
        transcript = transcript.replaceAll("<br>", "\n");
        transcript = transcript.replaceAll("<b>", "");
        transcript = transcript.replaceAll("</b>", "");

        const blob = new Blob([transcript], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.style.display = 'none';
        link.href = url;
        link.download = "session_transcript.txt";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    });

    document.getElementById("download_notes").addEventListener('click', function () {
        // pull results
        const sdg_response = sessionStorage.getItem("sdg_evaluation");
        const investment_response = sessionStorage.getItem("investment_evaluation");

        const blob = new Blob(["SDG Evaluation:\n" + sdg_response + "\n\nInvestment Evaluation:\n" + investment_response], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.style.display = 'none';
        link.href = url;
        link.download = "session_notes.txt";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    });

    document.getElementById("reenter_session").addEventListener("click", function () {
        sessionStorage.setItem("prev_location", "evaluation");
        location.href="home.html";
    });
}
