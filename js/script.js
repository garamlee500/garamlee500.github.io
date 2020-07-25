var game_active = false;
var x;
var y;

var current_ball_angle = 1;

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// apparently this detects if two elements overlap
function isOverlap (element1, element2) {
    var Element1 = {};
    var Element2 = {};

    Element1.top = $(element1).offset().top;
    Element1.left = $(element1).offset().left;
    Element1.right = Number($(element1).offset().left) + Number($(element1).width());
    Element1.bottom = Number($(element1).offset().top) + Number($(element1).height());

    Element2.top = $(element2).offset().top;
    Element2.left = $(element2).offset().left;
    Element2.right = Number($(element2).offset().left) + Number($(element2).width());
    Element2.bottom = Number($(element2).offset().top) + Number($(element2).height());

    return Element1.right > Element2.left && Element1.left < Element2.right && Element1.top < Element2.bottom && Element1.bottom > Element2.top 

}

// function to end game
function end_game (message) {
    
    // empty game window

    $('#game_window').empty()


    $('#game_window').html('<div id = "game_end_message">' + message + '</div>')
    // add message


    // start home after 2 seconds
    setTimeout(function(){
        start_home()
    }, 2000)
}

function move_ball(amount,deg, function_after_movement, function_parameter) {
    // formula to find change in x and y using angle and distance
    // if ball has touched left wall

    if ( $('#ball').css('left').slice(0,-2) <= convertRemToPixels(1)) {

        // get ball to middle of screen

        $('#ball').offset({top: $('#game_window').css('height').slice(0,-2)/2, left:$('#game_window').css('width').slice(0,-2)/2}, function_after_movement(function_parameter));
        
        // update score
        $('#computer_score').text(Number($('#computer_score').text())+1)

        // if computer score is 10 or more
        if(Number($('#computer_score').text())>=10){
            // end game

            game_active = false;

            end_game('The Computer won. You lost!')
        }

        current_ball_angle =   0
    }
        
    // if ball has touched right wall
    else if ( $('#ball').css('right').slice(0,-2) <= convertRemToPixels(1)) {

        $('#ball').offset({top: $('#game_window').css('height').slice(0,-2)/2, left:$('#game_window').css('width').slice(0,-2)/2}, function_after_movement(function_parameter));
        
        // update score
        $('#player_score').text(Number($('#player_score').text())+1)
        

        
        // if player score is 10 or more
        if(Number($('#player_score').text())>=10){
            // end game

            game_active = false;

            end_game('You won. Conratulations!!')

        }

        current_ball_angle =   180
    }

    else {
        
        x = Math.cos(deg*Math.PI/180) * amount;
        y = Math.sin(deg*Math.PI/180) * amount;


        //move ball in required place
        // finds previous value of 'top' adds change in y to it and then sets it to the new value of 'top'
        // Number() converts string to number
        new_x = Number($('#ball').css('left') .slice(0,-2)) + convertRemToPixels(x)
        new_y = Number($('#ball').css('top').slice(0,-2)) + convertRemToPixels(y)

                                                    // function_after_movement executes another check of all pong movements
        $('#ball').offset({top: new_y, left:new_x},    function_after_movement(function_parameter))
            

    }
}




function execute_game(difficulty) {

    // stop game if game not active
    if (game_active!=true){
        return
    }
    // keeep left paddle on screen
    if ($('#left_paddle').css('top').slice(0,-2)<0) {
        $('#left_paddle').css('top',0)
    }

    // for some reason bottom doesn't work so here's a work around. Investigating
    else if ($('#left_paddle').css('top').slice(0,-2) > $('#game_window').css('height').slice(0,-2) - $('#left_paddle').css('height').slice(0,-2)) {
        $('#left_paddle').css('top', $('#game_window').css('height').slice(0,-2) - $('#left_paddle').css('height').slice(0,-2))
    }


    // changes current_ball_angle to a postive number if not at the moment
    // if current_ball_angle is negative
    if (current_ball_angle<0) {
        // add 360 to it
        current_ball_angle+= 360
    }


    // changes current_ball angle if it is over 360
    if (current_ball_angle>360){
        current_ball_angle -= 360
    }

    // checks wether ball is going right or not
    if (270<current_ball_angle|| 90>current_ball_angle) {
        is_ball_going_right= true
    }
    else{
        is_ball_going_right= false
    }


    // check if two elements are touching
    if (isOverlap('#left_paddle','#ball')) {
        // find out location of ball from top
        let difference_from_top_of_paddle = $('#ball').css('top').slice(0,-2) - $('#left_paddle').css('top').slice(0,-2)

        // find height of paddle
        let total_paddle_size = $('#left_paddle').css('height').slice(0,-2)

        // find location of ball from top as decimal from top of paddle
        let percentage_down = difference_from_top_of_paddle/total_paddle_size

        // generates angle from 0 to 140 defrees from this
        let new_angle = percentage_down * 140
        if (new_angle > 140){
            new_angle=140
        }
        else if(new_angle < 0){
            new_angle=0
        }
        // take away 70 from angle to get angle from - 70 to 70 degrees
        current_ball_angle = new_angle - 70

    }

    // check if two elements are touching
    else if (isOverlap('#right_paddle','#ball')) {
        // find out location of ball from top
        let difference_from_top_of_paddle = $('#ball').css('top').slice(0,-2) - $('#right_paddle').css('top').slice(0,-2)

        // find height of paddle
        let total_paddle_size = $('#right_paddle').css('height').slice(0,-2)

        // find location of ball from top as decimal from top of paddle
        let percentage_down = difference_from_top_of_paddle/total_paddle_size

        // generates angle from 0 to 140 defrees from this
        let new_angle = percentage_down * 140

        // if angle is too big/small
        if (new_angle > 140){
            new_angle=140
        }
        else if(new_angle < 0){
            new_angle=0
        }
        // add 110 to get angles between 110 and 250 degrees
        current_ball_angle = new_angle + 110

    }


    // if ball is outside frame
    //  if ball's distance from top below 0 or bottom below 0
    // if ball has touched top wall
    else if ( $('#ball').css('top').slice(0,-2) <=convertRemToPixels(1)){

        // if ball is going right and at an angle between 360 and 270 degrees
        if(is_ball_going_right && 360 > current_ball_angle && current_ball_angle> 270)      {
            // change  angle to new direction
            current_ball_angle = 0 - current_ball_angle
        }
        else if (is_ball_going_right ===false && 270 > current_ball_angle && current_ball_angle> 180){
            current_ball_angle = 360 - current_ball_angle



        }
    }


    // else if ball has touched bottom wall
    else if ( $('#ball').css('bottom').slice(0,-2) <= convertRemToPixels(1)) {

        // if ball is going right at an angle between 90 and 0 degrees
        if(is_ball_going_right &&  90 > current_ball_angle && current_ball_angle > 0) {
            // change  angle to new direction
            current_ball_angle = 0 - current_ball_angle
        }
        // else if ball is going left at an angle between 90 and 180 degrees

        else if(is_ball_going_right ===false &&  180 > current_ball_angle && current_ball_angle > 90) {

            current_ball_angle = 360 - current_ball_angle

        }

    }
    // move ball
    // if max difficulty

    if (difficulty >= 6){
        // keep right paddle on the ball
        let ball_top = $('#ball').css('top').slice(0,-2) - $('#right_paddle').css('height').slice(0,-2)/2
        // why this works and the normal .css('top',value) doesn't work is beyond me
        $('#right_paddle').offset({top: ball_top});
    }
    else {
        let ball_top = $('#ball').css('top').slice(0,-2) - $('#right_paddle').css('height').slice(0,-2)/2

        // if ball above paddle
        if (ball_top< $('#right_paddle').css('top').slice(0,-2)){
            // move paddle down
            $('#right_paddle').offset({top: $('#right_paddle').css('top').slice(0,-2)-difficulty*1.2})
        }

        else {
        // move paddle up
        // big brain javascript requires type conversion for addition but not for subtraction
        $('#right_paddle').offset({top: Number($('#right_paddle').css('top').slice(0,-2))+difficulty*1.2})
        }
    }

    // if game is still active
    if (game_active){
        setTimeout(function() {
                                            // (notrelevant)continue game only after animation is finished - by default, jquery animations are asynchrounous
                    // the number controls some value - probably distance. making it big seems to make ball go quick
            move_ball((difficulty*0.1), current_ball_angle, execute_game, difficulty)
             // delay - controls frame rate - 
        }, 3)}
    

    
}


function game(difficulty){ 
    this.difficulty = difficulty,

    this.start_game = function(){

        $('#game_window').empty()
        console.log('game starting')
        // create paddles 
        $('#game_window').append('<div id="right_paddle"></div>')
        $('#game_window').append('<div id="left_paddle"></div>')
        
        // create score boards 
        $('#game_window').append('  <div id="player_score" class="score">0</div>')
        $('#game_window').append('<div id="computer_score" class="score">0</div>')

        // create ball
        $('#game_window').append('<div id="ball"></div>')

        $// draw center line
        $('#game_window').append('<div id="center_line"></div>')
        $('#center_line').stop(true).animate({left : '-=0.3rem'},0) // auto adjust center line to center
        

        game_active = true;
        execute_game(difficulty)
    }



    
}

function start_home (){
    
    // empty game window
    $('#game_window').empty()
    // create enterance thing
    $('#game_window').append('<div id="title">Pong</div>')

    // add instructions

    $('#game_window').append('<div id="instruction">&nbsp;Move the left <br>&nbsp;paddle using ↑ and ↓!')

    $('#game_window').append("<div id='difficulties'>" +
                            '<div class="difficulty_button" id="easy">Easy!</div>' +
                            '<div class="difficulty_button" id="medium">Medium!</div>' +
                            '<div class="difficulty_button" id="hard">Hard</div></div>')    

    


}
$(document).ready(function(){
    // add event handlers : ( Adding multiple handlers for the same event triggered game twice which was very bad)
    
    // detect press
    $('#game_window').on('click', '#easy', function(){
        // empty game_window
        $('#game_window').empty()

        // start game on easy
        current_game = new game(2.5)
        current_game.start_game()
    })

    $('#game_window').on('click', '#medium', function(){
        // empty game_window
        $('#game_window').empty()

        // start game on medium
        current_game = new game(5)
        current_game.start_game()
    })

    $('#game_window').on('click', '#hard', function(){
        // empty game_window
        $('#game_window').empty()

        // start game on medium
        current_game = new game(7)
        current_game.start_game()
    })
    
    start_home()
})


var change = { // this code makes paddle move smoothly 
    38: {
    top: "-=5"
    },
    83: {
        top:"-5"
    },

    87: {
        top: "+5"
    },
    40: {
    top: "+=5"
    },
}
$(document).one("keydown", keyDown)

var going;

function keyDown(e) {
    $(document).one("keyup", keyup)
    var animation = change[e.which];
    going = setInterval(keepGoing, 1);

    function keepGoing() {
    $("#left_paddle").css(animation)
    }

}

function keyup(e) {
    clearInterval(going)
    $(document).one("keydown", keyDown)
}