function verifyAnswer() {
    var answer = document.getElementById('answerInput').value;
    if (answer === "salajanesalasõna") {
        document.getElementById('feedback').innerHTML = '<p>Õige! Lipp on "c0mm3n75"</p>';
    } else {
        document.getElementById('feedback').innerHTML = "<p>Vale vastus. Proovi uuesti.</p>";
    }
}