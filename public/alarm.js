const music = new Audio('Clock-Alarm05-mp3/clock_alarm');
 
 //時計を動かす
 function updateCurrentTime(){
    setTimeout(function(){
        currentDate = new Date();
        hours = adjustDigit(currentDate.getHours());
        minutes = adjustDigit(currentDate.getMinutes());
        seconds = adjustDigit(currentDate.getSeconds());
        timerText.innerHTML = `${hours}:${minutes}:${seconds}`;

        //アラーム機能
        //for (var i = 0, len = record.length; i < len; i++){
          //  if (record[i].sethour == currentDate.getHours() && record[i].setminute == currentDate.getMinutes() && seconds == 0){
          //      music.play();
         //   };
       // };
        updateCurrentTime();
    }, 1000);
}updateCurrentTime();



music.play();
