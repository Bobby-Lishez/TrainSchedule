// Initialize Firebase
var config = {
    apiKey: "AIzaSyA1vjq4ngoinhSEwdAdQWN6OhLUXFfvu48",
    authDomain: "train-schedule-2e7d0.firebaseapp.com",
    databaseURL: "https://train-schedule-2e7d0.firebaseio.com",
    projectId: "train-schedule-2e7d0",
    storageBucket: "train-schedule-2e7d0.appspot.com",
    messagingSenderId: "977866878398"
  };
  firebase.initializeApp(config);
var database = firebase.database();

//function to add a new train
$("#go").click(function(event){
    event.preventDefault();
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstHH = $("#firstTrainHH").val();
        if (firstHH > 23) {firstHH = 23};
    var firstMM = $("#firstTrainMM").val();
        if (firstMM > 59) {firstMM = 59};
    var firstTrain = (firstHH + ":" + firstMM);
    var frequency = $("#frequency").val();
    console.log (trainName, destination, firstTrain, frequency);
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainHH").val("");
    $("#firstTrainMM").val("");
    $("#frequency").val("");
});

//function to update the schedule table
database.ref().on("child_added", function(childSnapshot) {
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;
    var minutesAway = 0;
    var nextTrain = "00:00";
    var today = new Date();
    var now = moment(today.getHours() + ":" + today.getMinutes(),"HH:mm");
    var then = moment(firstTrain, "HH:mm");
    var difference = (now.diff(then));
    console.log("difference: " + difference);
    var minDifference = moment.duration(difference).asMinutes();
    console.log("minDifference: " + minDifference);
    if (minDifference < 0) {
        minutesAway = -1 * minDifference;
        nextTrain = firstTrain;
        console.log(minutesAway, nextTrain);
    }
    else {
    var trains = Math.floor(minDifference/frequency);
    var sinceLast = minDifference - (trains * frequency);
    minutesAway = frequency - sinceLast;
    var next = minDifference + minutesAway;
    console.log(next);
    nextTrain = then.add(next * 60000).format("HH:mm");
    }
    $("#trainTable").append(
        "<tr>" +
        "<td>" + trainName + "</td>" +
        "<td>" + destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + nextTrain + "</td>" +
        "<td>" + minutesAway + "</td>"
    );
});