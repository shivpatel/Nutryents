var previousSearchResult = [];
var foods = [];
var previousScatter = [];

$(document).on("keyup", "input#search", function(e) {
    // Set Timeout
    clearTimeout($.data(this, 'timer'));
    // Set Search String
    var search_string = $(this).val();
    // Do Search
    if (search_string == '') {
        // empty search string
        $('.search-results').html("");
    } else {
        $(this).data('timer', setTimeout(getSearchResults, 200));
    };
});

$(document).click(function(event) { 
    if(!$(event.target).closest('.todo').length) {
        $('#search').val("");
        $('.search-results').slideUp(function(){
            $('.search-results').html("");
            $('.search-results').slideDown();
        });
    }        
})

$("#goal").change(function () {
    regenerateAnalysis();
});

$("#gender").change(function () {
    regenerateAnalysis();
});

$("#body-type").change(function () {
    regenerateAnalysis();
});

$("#treemap-selector").change(function () {
    generateTreeMap();
});

$("#food-group-selector").change(function () {
    generateScatterplot();
});


function getSearchResults() {
    $.get( "/api/search?query=" + $('#search').val(), function( data ) {
        var html = '';
        previousSearchResult = data;
        for (var i = 0; i < data.length; i++) {
            html = html + '<li onclick="foodToggle(this)" id="'+data[i].id+'"><div class="todo-content"><h4 class="todo-name">'+data[i].name+'</h4>'+data[i].food_group+'</div></li>';
        }
        $('.search-results').html(html);
    });
}

function foodToggle(element) {
    var foodItemId = $(element).attr('id');
    if ($(element).attr('class') == undefined) {
        for (var i = 0; i < previousSearchResult.length; i++) {
            if (previousSearchResult[i].id == foodItemId) {
                previousSearchResult[i].amount = 1;
                foods.push(previousSearchResult[i]);
                regenerateFoodList();
                return;
            }
        }
    } else {
        for (var i = 0; i < foods.length; i++) {
            if (foods[i].id == foodItemId) {
                foods.splice(i,1);
                regenerateFoodList();
                return;
            }
        }
    }
}

function regenerateFoodList() {
    var html = '';
    for (var i = 0; i < foods.length; i++) {
        html = html + '<li class="todo-done" onclick="foodToggle(this)" id="'+foods[i].id+'"><div class="todo-content"><h4 class="todo-name">'+foods[i].name+'</h4>'+foods[i].food_group+'</div></li>';
    }
    $('.foods-added').html(html);
    regenerateAnalysis();
    generateTreeMap();
}

function regenerateAnalysis() {
    var build = $('#goal').val();
    var body_type = $('#body-type').val();
    var gender = $('#gender').val();
    var sums = macroSums();
    var ranges = recommendedRanges(build, body_type, gender);

    if (Number(sums.carbsCaloriePercent || 0) < Number(ranges.carbs.min)) {
        var carb_color = "orange";
    } else if (Number(sums.carbsCaloriePercent || 0) > Number(ranges.carbs.max)) {
        var carb_color = "red";
    } else {
        var carb_color = "green";
    }

    if (Number(sums.proteinCaloriePercent || 0) < Number(ranges.protein.min)) {
        var protein_color = "orange";
    } else if (Number(sums.proteinCaloriePercent || 0) > Number(ranges.protein.max)) {
        var protein_color = "red";
    } else {
        var protein_color = "green";
    }

    if (Number(sums.fatCaloriePercent || 0) < Number(ranges.fat.min)) {
        var fat_color = "orange";
    } else if (Number(sums.fatCaloriePercent || 0) > Number(ranges.fat.max)) {
        var fat_color = "red";
    } else {
        var fat_color = "green";
    }

    $('#recommended-carbs').html(ranges.carbs.min + "-" + ranges.carbs.max + "%");
    $('#recommended-protein').html(ranges.protein.min + "-" + ranges.protein.max + "%");
    $('#recommended-fat').html(ranges.fat.min + "-" + ranges.fat.max + "%");
    $('#user-carbs').html('<span style="color:' + carb_color + ';">' + (sums.carbsCaloriePercent || 0) + "%</span>");
    $('#user-protein').html('<span style="color:' + protein_color + ';">' + (sums.proteinCaloriePercent || 0) + "%</span>");
    $('#user-fat').html('<span style="color:' + fat_color + ';">' + (sums.fatCaloriePercent || 0) + "%</span>");
}

function macroSums() {
    var carbs = 0;
    var protein = 0;
    var fat = 0;
    var calories = 0;
    var caloriesPerGramOfFat = 9;
    var caloriesPerGramOfProtein = 4;
    var caloriesPerGramOfCarb = 4;
    for (var i = 0; i < foods.length; i++) {
        carbs = carbs + (Number(foods[i].carbs) * Number(foods[i].amount));
        protein = protein + (Number(foods[i].protein) * Number(foods[i].amount));
        fat = fat + (Number(foods[i].fat) * Number(foods[i].amount));
        calories = calories + (Number(foods[i].energy) * Number(foods[i].amount));
    }
    var calories = calories;
    return {
        carbs: carbs,
        protein: protein,
        fat: fat,
        calories: calories,
        carbsCaloriePercent: Math.round(((carbs * caloriesPerGramOfCarb) / calories) * 10000) / 100,
        proteinCaloriePercent: Math.round(((protein * caloriesPerGramOfProtein) / calories) * 10000) / 100,
        fatCaloriePercent: Math.round(((fat * caloriesPerGramOfCarb) / calories) * 10000) / 100 
    };
}

function recommendedRanges(fitness_goal, body_type, gender) {
    
    var result = {
        carbs   : { min : 0, max: 0},
        protein : { min : 0, max: 0},
        fat     : { min : 0, max: 0},
    }

    if (fitness_goal == "build") {
        result.carbs.min    = 40;
        result.carbs.max    = 60;
        result.protein.min  = 25;
        result.protein.max  = 35;
        result.fat.min      = 15;
        result.fat.max      = 25;
    } else if (fitness_goal == "maintenance") {
        result.carbs.min    = 30;
        result.carbs.max    = 50;
        result.protein.min  = 25;
        result.protein.max  = 35;
        result.fat.min      = 25;
        result.fat.max      = 35;
    } else {
        result.carbs.min    = 10;
        result.carbs.max    = 30;
        result.protein.min  = 40;
        result.protein.max  = 50;
        result.fat.min      = 30;
        result.fat.max      = 40;
    }

    if (body_type == "ectomorph") {
        result.carbs.min    = 30;
    } else if (body_type == "mesomorph") {
        if (fitness_goal == "loss") {
            result.carbs.min    = 20;
            result.carbs.max    = 30;
        } else if (fitness_goal == "build") {
            result.carbs.min    = 40;
            result.carbs.max    = 50;
        } else {
            result.carbs.min    = 30;
            result.carbs.max    = 40;
        }
    } else {
        if (fitness_goal == "loss") {
            result.carbs.min    = 10;
            result.carbs.max    = 20;
        } else if (fitness_goal == "build") {
            result.carbs.min    = 30;
            result.carbs.max    = 40;
        } else {
            result.carbs.min    = 20;
            result.carbs.max    = 30;
        }
        result.fat.min          = 15;
        result.fat.max          = 40;
        result.protein.min      = 25;
        result.protein.max      = 50;
    }

    if (gender == "female") {
        result.carbs.min    = result.carbs.min - 10;
        result.carbs.max    = result.carbs.max - 10;
        result.fat.min      = result.fat.min + 5;
        result.fat.max      = result.fat.max + 5;
    }

    return result;

}

/************
 * D3 Stuff
 ************/

function generateTreeMap() {
    $('#viz1').fadeOut(function() {
        var visualization = d3plus.viz()
        .container("#viz1")  // container DIV to hold the visualization
        .data(foods)  // data to use with the visualization
        .type("tree_map")   // visualization type
        .id("name")         // key for which our data is unique on
        .size($('#treemap-selector').val())      // sizing of blocks
        .width({secondary:false})
        .height(250)
        .labels(false)
        .color("food_group")
        .timing({transitions:0})
        .draw();            // finally, draw the visualization!
    }).fadeIn();
}

function generateScatterplot() {
    $.get( "/api/search/category?query=" + $('#food-group-selector').val(), function( data ) {
        previousSearchResult = data;
        previousScatter = data;
        $('#search').val("");
        $('.search-results').html("");
       $('#viz2').fadeOut(function() {

            var visualization2 = d3plus.viz()
            .container("#viz2")  // container DIV to hold the visualization
            .data(data)  // data to use with the visualization
            .type("scatter")    // visualization type
            .text("name")
            .id("id")         // key for which our data is unique on
            .x("energy")         // key for x-axis
            .y("protein")        // key for y-axis
            .width({secondary:false})
            .color("food_group")
            // .color({scale:"category10"})
            .labels(true)
            .size(10)
            .height(350)
            .draw();             // finally, draw the visualization!

            // d3.select("#viz2")
            // .datum(data)
            // .call(visualization2)

        }).fadeIn(function() {

            $(".d3plus_data").click(function() { 
                foods.push(getScatterClickedItem());
                regenerateFoodList();
                console.log("Graph click on: " + $('#d3plus_tooltip_id_scatter').text());
            });

        }); 
    });
}

function getScatterClickedItem() {
    for (var i = 0; i < previousScatter.length; i++) {
        if (previousScatter[i].name.toLowerCase() == $('#d3plus_tooltip_id_scatter').text().toLowerCase()) {
            previousScatter[i].amount = 1;
            return previousScatter[i];
        }
    }
    return -1;
}

function clearAll() {
    foods = [];
    regenerateFoodList();

}