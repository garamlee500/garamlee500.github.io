var game_active = false;

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function move(amount) {
    // animate the left paddle
    // if left paddle top is less than 1rem and you wnat to go up
    if ($('#left_paddle').css('top').slice(0,-2) < convertRemToPixels(1) && Math.abs(amount) == amount) {
        // if paddle isn't already on top
        if  ($('#left_paddle').css('top').slice(0,-2)!=0){

            // move paddle to top
            $('#left_paddle').animate({
                top: '=0'
            }, 10) 
        }
    }
    // else if paddle bottom is less then 1 rem and you want to go down
    else if ($('#left_paddle').css('bottom').slice(0,-2) < convertRemToPixels(1) && Math.abs(amount) != amount){
            // if paddle isn't already on bottom
            if  ($('#left_paddle').css('top').slice(0,-2)!=0){
                $('#left_paddle').animate({
                    bottom: '=0'
                }, 10) 
            }
    } // 


    else {
        $('#left_paddle').animate({
            // change top amount by amount variable
            top: '-='+amount +'rem'
        }, 10)
    }
}


function move_ball(amount,deg) {
    // formula to find change in x and y using angle and distance
    var x = Math.cos(deg*Math.PI/180) * amount;
    var y = Math.sin(deg*Math.PI/180) * amount;

    //move ball in required place
    $('#ball').animate({
        left: "+="+x+'rem',
        top: "+="+y+'rem',
    }, amount*50)
}

function execute_game() {
    let current_ball_angle = 180;

    console.log('game set up completed')
    let i =0;
    while(game_active){
        // checks wether ball is going right or not
        if (270<current_ball_angle|| 90>current_ball_angle) {
            is_ball_going_right= true
        }
        else{
            is_ball_going_right= false
        }

        // if ball is outside frame
        if ( $('#ball').outerHeight(true) > $('#game_window').height()){
            // if ball is going right
            if(is_ball_going_right)      {
                // change  angle to new direction
                current_ball_angle = 0 - current_ball_angle
            }
            else {
                current_ball_angle = 0 - current_ball_angle
            }
        }
        // move ball

        // delay of 2 milliseconds
        setTimeout(function() {
            move_ball(10, current_ball_angle)
        }, 2000
        )
    
    }

}


function game(ball_speed, difficulty){
    this.ball_speed = ball_speed,   
    this.difficulty = difficulty,

    this.start_game = function(){
        console.log('game starting')
        // create paddles 
        $('#game_window').append('<div id="right_paddle"></div>')
        $('#game_window').append('<div id="left_paddle"></div>')
        
        // create ball
        $('#game_window').append('<div id="ball"></div>')

        $// draw center line
        $('#game_window').append('<div id="center_line"></div>')
        $('#center_line').animate({left : '-=0.3rem'},0) // auto adjust center line to center
        

        // check for key press
        $('body').keydown(function(event){

            // detect key pressed
            let keycode = (event.keyCode ? event.keyCode : event.which);

            // if up arrow pressed (unicode 38)
            if(keycode == '38'){
                // move up 10
                move(1)
            }

            // if down arrow pressed (uncicode 40)
            if(keycode == '40'){
                // move down 10
                move(-1)
            }

        })
        game_active = true;
        execute_game()
    }


    this.end_game = function() {
        }

    
}

    
current_game = new game(10,10)
current_game.start_game()