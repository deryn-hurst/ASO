// integrating text to speech
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.maxAlternatives = 1;

if(document.title === "ASO - Your All In One Startup Coach"){
    document.getElementById("control_session").addEventListener("click", function () {
        if(document.getElementById("control_session").innerHTML === "stop session"){
            document.getElementById("control_session").innerHTML = "start session";
            recognition.stop();
            // pull and clean transcript
            let transcript = document.getElementById("content").innerHTML;
            transcript = transcript.replaceAll("<br>", "");
            transcript = transcript.replaceAll("<b>", "");
            transcript = transcript.replaceAll("</b>", "");
            sessionStorage.setItem('transcript', transcript);
            location.href = "evaluation.html";
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
                document.getElementById("content").innerHTML += "<br><b>user</b>: " + document.getElementById("current_speech").innerHTML + "<br>";
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
    document.getElementById("download_transcript").addEventListener('click', function () {
        const blob = new Blob([sessionStorage.getItem('transcript')], {type: 'text/plain'});
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
}