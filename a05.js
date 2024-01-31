/* 
 * Assignment 5: This script obtains data from PoliceKillingsUs.csv and 
 * displays them in a scatterplot of the dates of the fatal 
 * encounters against the states they occurred in
 * Author     : Emmanuel Simiyu (A00439371)
 */

const DEFAULT_SIZE = 5;
var scaleX, scaleY;

/*
 * Webpage body onload function
 */
$("body").ready(() => {
    
    d3.csv("PoliceKillingsUS.csv")
            .then(
            (data) => {
               dropdowns(data);
               createRadios(data);
               draw(data);
            });
    }
);

/**
 * This function constructs the scales used in the scatterplot and displays
 * them in the left and bottom axis. It also displays a legend for the plot.
 * 
 * @param {type} data the dataset
 * @param {type} sorted subset of sorted states
 * @param {type} h height
 * @returns {undefined}
 */
function scales(data, sorted, h){  
    var dates = getUnique(data.map((d)=>{
        return (d.date);
    }));
    
    var col = sorted.map((c)=>{
        return (c[0]);
    });
    
    var xMin = new Date(d3.min(dates));
    var xMax = new Date(d3.max(dates));
    
    //scaling the datasets
    scaleX = d3.scaleTime()
            .domain([xMin, xMax])
            .range([30,$(window).width() - 20]);
    
    scaleY = d3.scalePoint()
            .domain(col)
            .range([30,h - 20]);      
    
    var xAxis = d3.axisBottom()
            .scale(scaleX);
    
    d3.select("#chart")
            .append("g")
            .call(xAxis);
    
   var yAxis = d3.axisLeft()
            .scale(scaleY);
    
    d3.select("#chart")
            .append("g")
            .attr("transform","translate(25,0)")
            .call(yAxis); 
    
    d3.select("#chart")
            .append("text")
            .attr('x', 20)
            .attr('y', h + 10)
            .attr('fill', 'black')
            .text("States");
    
    d3.select("#chart")
            .append("text")
            .attr('x', ($(window).width()- 15))
            .attr('y', 30)
            .attr('fill', 'black')
            .attr("transform", "rotate(-90deg)")
            .text("Dates");
    
    //append the legend elements
    var b = 80;
    d3.select("#chart")
            .append("text")
            .attr('x', 80 + b)
            .attr('y', h + 60)
            .attr('fill', 'darkslategray')
            .style("font-size", "12px")
            .attr("stroke","darkslategray")
            .attr("stroke-width","0.5px")
            .text("LEGEND ~ ");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 150+ b)
            .attr('y', h + 60)
            .attr('fill', 'black')
            .style("font-size", "13px")
            .attr("stroke","black")
            .attr("stroke-width","0.5px")
            .text("Male: circles");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 240+ b)
            .attr('y', h + 60)
            .attr('fill', 'black')
            .style("font-size", "13px")
            .attr("stroke","black")
            .attr("stroke-width","0.5px")
            .text("Female: squares");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 353+ b)
            .attr('y', h + 60)
            .attr('fill', 'darkslategray')
            .style("font-size", "13px")
            .attr("stroke","darkslategray")
            .attr("stroke-width","0.5px")
            .text("||");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 370+ b)
            .attr('y', h + 60)
            .attr('fill', 'red')
            .style("font-size", "13px")
            .attr("stroke","red")
            .attr("stroke-width","0.5px")
            .text("Asian: red");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 450+ b)
            .attr('y', h + 60)
            .attr('fill', 'black')
            .style("font-size", "13px")
            .attr("stroke","black")
            .attr("stroke-width","0.5px")
            .text("Black: black");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 540+ b)
            .attr('y', h + 60)
            .attr('fill', 'lightgreen')
            .style("font-size", "13px")
            .attr("stroke","lightgreen")
            .attr("stroke-width","0.5px")
            .text("Hispanic: lightgreen");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 680+ b)
            .attr('y', h + 60)
            .attr('fill', 'indigo')
            .attr("stroke","indigo")
            .style("font-size", "13px")
            .attr("stroke-width","0.5px")
            .text("Native: indigo");
    
    d3.select("#chart")
            .append("text")
            .attr('x',780+ b)
            .attr('y', h + 60)
            .attr('fill', 'white')
            .attr("stroke","white")
            .style("font-size", "13px")
            .attr("stroke-width","0.5px")
            .text("Other: white");
    
    d3.select("#chart")
            .append("text")
            .attr('x', 870+ b)
            .attr('y', h + 60)
            .attr('fill', 'orange')
            .attr("stroke","orange")
            .attr("stroke-width","0.5px")
            .style("font-size", "13px")
            .text("White: orange");
    
}

/*
 * This function returns a subset of the unique values
 * in the provided dataset. The parameter a is a column of values,
 * the dataset provided to extract the unique values from.
 * 
 * @param {type} a dataset
 * @returns sorted list of unique items
 */
function getUnique(a){
    //create a new array u to hold the dataset of unique values. 
    var u = a.filter((v,i)=>{
        //check against every value, return true if the index of the 1st occurence is the current index
        //It returns only the first instances of values in the dataset al thus only the unique values
        return a.indexOf(v)==i;
    });
    //Sorts the values in alaphabetical order
    return u.sort();
}

/*
 * Create the two dropdown lists for use in filtering, by Arms and by Race
 * 
 * @param {type} data - the dataset to be used
 */
function dropdowns(data){
    //create a <select> object with appropriate styles and specifications
    var drop1 = $("<select>")
            .attr("id","select1")
            .attr("style", "background-color: lightgrey")
            .change(()=>{
                draw(data);
    });
    
    //create an array col that receives only values of a certain column(armed)
    // of v mapped onto it
    var col = data.map((v)=>{
        return (v.armed);
    });
    
    //using the getUnique function in a), obtain an array of only unique values in col
    var unique= getUnique(col);
        
    //add all as an option value in the <select> object
    drop1.append("<option value='all'>ALL</option>");
    
    //add each unique element as an option value in the <select> object
    unique.forEach((v)=>{
        drop1.append("<option value='"
                + v + "'>" + v + "</option>");
    });
    
    //append the <select> object and its styled label to the controls div
    $("#arms").append("label")
            .attr("for","select1")
            .attr("color", "gold")
            .html("Armed: ");
    $("#arms").append(drop1);  
    
    //create a <select> object with appropriate styles and specifications
    var drop2 = $("<select>")
            .attr("id","select2")
            .attr("style", "background-color: lightgrey")
            .change(()=>{
                draw(data);
    });
    
    //create an array col that receives only values of a certain column(Race)
    // of v mapped onto it
    var col2 = data.map((c)=>{
        return (c.race);
    });
        
    //using the getUnique function in a), obtain an array of only unique values in col
    var uniqueL= getUnique(col2);
        
    //add all as an option value in the <select> object
    drop2.append("<option value='all'>ALL</option>");
    
    //add each unique element as an option value in the <select> object
    uniqueL.forEach((c)=>{
        drop2.append("<option value='"
                + c + "'>" + c + "</option>");
    });
    
    //append the <select> object and its styled label to the controls div
    $("#race").append("label")
            .attr("for","select2")
            .attr("color", "gold")
            .html("Race: ");
    $("#race").append(drop2);
}

/*
 * Filters data against specific keys to obtain a subset of it
 * 
 * @param {type} data - dataset to be filtered from
 * @param {type} unique key1 used to filter out elements without the key
 * @param {type} unique key1 used to filter out elements without the key
 * @returns dataset of elements which passed the key check.
 */
function filterData(data, key1, key2){
    //create an array of the new filtered subset od the dataset v
    var filtered= data.filter((v)=>{
        if (key1=="all" && key2 =="all"){
            //return true for all elements if both keys are the value 'all'
            return true;
        }else if (key1=="all"){
            //if key1 is 'all', return true only for elements whose Race
            //column matches value specified in key2
            return v.race == key2;
        }else if (key2=="all"){
            //if key2 is 'all', return true only for elements whose armed
            //column matches value specified in key1
            return v.armed == key1;
        }else{
            //If both key1 and key2 are specified, return true only for elements 
            //whose values in both the armed and race column match key1 and
            //key2 respectively
            return v.armed == key1 && v.race == key2;
        }
    });  
    //return the filtered dataset
    return filtered;
}

/*
 * Sorts States by given parameters(State alphabetical order or number of deaths)
 * 
 * @param {type} counts - unsorted object list
 * @returns {U[]|sortData.copy} sorted list
 */
function sortData(counts){
    //Create an array copy of the object entries
    var copy = Array.from(Object.entries(counts));
    
    //create a new array of sorted elements
    var sorted = copy.sort((a,b)=> {
        if($("#deaths").is(":checked")){
            //if deaths button is checked, sorts the states from highest to lowest
            // death count
            return d3.descending(a[1], b[1]);
        }else if ($("#state").is(":checked")){
            //if state button is checked, sorts states by alphabetical order
            // of their names
            return d3.ascending(a[0], b[0]);
        }else{
            //return the unaltered copy
            return copy;
        }
    });
    
   //return new list of sorted elements
    return sorted;
}

/*
 * Creates fieldset and Radio buttons
 * 
 * @param {type} data - the dataset
 */
function createRadios(data){
    //fieldset 1 - gender filter
    var field = d3.select("#gender")
            .append("fieldset")
            .style("width","250px");
    
    field.append("legend")
            .html("Gender: ")
            .style("color","gold");
    
    field.append("input")
            .attr("type","radio")
            .attr("name","choice")
            .attr("value","both")
            .attr("id","both")
            .attr("checked","true");
    field.append("label")
            .attr("for","both")
            .html("Both")
            .style("color","gold")
            .style("padding-right","15px");
    
    field.append("input")
            .attr("type","radio")
            .attr("name","choice")
            .attr("value","male")
            .attr("id","male");
    field.append("label")
            .attr("for","male")
            .html("Male")
            .style("color","gold")
            .style("padding-right","15px");
    
    field.append("input")
            .attr("type","radio")
            .attr("name","choice")
            .attr("value","female")
            .attr("id","female");
    field.append("label")
            .attr("for","female")
            .html("Female")
            .style("color","gold");
    
    //fieldset 2 - sorting
    var field2 = d3.select("#radioBox")
            .append("fieldset")
            .style("width","250px");
    
    field2.append("legend")
            .html("Order States by: ")
            .style("color","gold");
    
    field2.append("input")
            .attr("type","radio")
            .attr("name","option")
            .attr("value","state")
            .attr("id","state")
            .attr("checked","true");
    field2.append("label")
            .attr("for","state")
            .html("Alphabet")
            .style("color","gold")
            .style("padding-right","15px");
    
    field2.append("input")
            .attr("type","radio")
            .attr("name","option")
            .attr("value","deaths")
            .attr("id","deaths");
    field2.append("label")
            .attr("for","deaths")
            .html("Fatalities count")
            .style("color","gold");
    
    
    $("input:radio[name=choice]").change(()=>{
          draw(data);
    });
    
    $("input:radio[name=option]").change(()=>{
          draw(data);
    });
}

/*
 * Draw visual representations of the required dataset on the svg
 * 
 * @param {type} data - dataset
 */
function draw(data){
    var filtered = filterData(data,$("#select1 option:selected").val(),
    $("#select2 option:selected").val());  
    var gendered=[];
    var genderF=[];
    var genderM=[];
    
    //split the elements by gender into two arrays
    for(let i=0; i<filtered.length;i++){
        if($("#male").is(":checked") && filtered[i].gender == 'M'){
            genderM.push(filtered[i]);
            gendered.push(filtered[i]);
        }else if ($("#female").is(":checked") && filtered[i].gender == 'F'){
            genderF.push(filtered[i]);
            gendered.push(filtered[i]);
        }else if ($("#both").is(":checked")){
            gendered.push(filtered[i]);
            if(filtered[i].gender == 'M'){
                genderM.push(filtered[i]);
            }else if(filtered[i].gender == 'F'){
                genderF.push(filtered[i]);
            }
        }
    }
    
    var columns = gendered.map((c)=>{
        return (c.state);
    });
    
    const counts = {};

    //obtain a count for the fatalities in each state, store in an object
    for (const num of columns) {
      counts[num] = (counts[num] || 0) + 1;
    }
    
    //make a dynamic height for the svg, changes with the length of the dataset
    var H;
    if(gendered.length == 0){
        H = 50;
    }else if(gendered.length < 20){
        H = $(window).width()/4;
    }else if(gendered.length < 80){
        H = $(window).width()/3;
    }else if(gendered.length < 500){
        H = $(window).width()/2;
    }else if(gendered.length < 800){
        H = $(window).width();
    }else if(gendered.length < 1300){
        H = gendered.length * (0.8);
    }else{
        H = gendered.length * (0.5);
    }
    
    var sorted = sortData(counts);

    $("svg").empty();
    
    //create svg
    d3.select("#chart")
            .style("width", $(window).width() + 30)
            .style("height",H + 100)
            .style("background-color","darkgrey");
    
    //create scales
    scales(gendered, sorted, H);
    
    //represent the male subset using circles
    d3.select("#chart")
            .selectAll("circle")
            .data(genderM)
            .enter()
            .append("circle")
            .attr("cx", (d)=>{
                return scaleX(new Date(d.date));})
            .attr("cy", (d)=>{
                return scaleY(d.state);})
            .attr("r", 5)
            .attr("fill",(d)=>{
                var color;
                if(d.race == 'Asian'){
                   color = "red";
                }else if(d.race == 'Black'){
                    color = "black";
                }else if(d.race == 'Hispanic'){
                    color = "lightgreen";
                }else if(d.race == 'Native'){
                    color = "indigo";
                }else if(d.race == 'White'){
                    color = "orange";
                }else{
                    color = "white";
                }
                return color;})
            .attr("stroke-width","0px")
            .style("opacity", 0.7)
            .style("transition", "all 250ms ease-in-out")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
    
    //represent the female subset using squares
    d3.select("#chart")
            .selectAll("square")
            .data(genderF)
            .enter()
            .append("rect")
            .attr("x", (d)=>{
                return scaleX(new Date(d.date)) - DEFAULT_SIZE;})
            .attr("y", (d)=>{
                return scaleY(d.state) - DEFAULT_SIZE;})
            .attr("width", (d)=>{
                return DEFAULT_SIZE*2;})
            .attr("height", (d)=>{
                return DEFAULT_SIZE*2;})
            .attr("fill",(d)=>{
                var color;
                if(d.race == 'Asian'){
                   color = "red";
                }else if(d.race == 'Black'){
                    color = "black";
                }else if(d.race == 'Hispanic'){
                    color = "lightgreen";
                }else if(d.race == 'Native'){
                    color = "indigo";
                }else if(d.race == 'White'){
                    color = "orange";
                }else{
                    color = "white";
                }
                return color;})
            .attr("stroke-width","0px")
            .style("opacity", 0.7)
            .style("transition", "all 250ms ease-in-out")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
    
}

/**
 * Event handler for when the mouse hovers over a marker
 * @param {type} event
 * @param {type} d
 */
function handleMouseOver(event, d){
    if(d.gender == "M"){
        d3.select(event.target)
                .attr("r", 20)
                .style("opacity", 1);
    }else if(d.gender == "F"){
        d3.select(event.target)
            .attr("width", (d)=>{
                return DEFAULT_SIZE*8;})
            .attr("height", (d)=>{
                return DEFAULT_SIZE*8;})
            .style("opacity", 1)
            .attr("x", (d)=>{
                return scaleX(new Date(d.date)) - (DEFAULT_SIZE*4);})
            .attr("y", (d)=>{
                return scaleY(d.state) - (DEFAULT_SIZE*4);});
    }
    
    //bring into view a floater with  details on the represented data
    d3.select("#floater")
            .style("left", (scaleX(new Date(d.date)) + 12) + "px")
            .style("top", (scaleY(d.state) + 280)+ "px")
            .style("text-align", "centre")
            .style("font-size", "13px")
            .style("padding", "3px")
            .style("border-radius", "5px")
            .html("State:\t"+ d.state +"<br>"
                    +"Date:\t"+ d.date +"<br>"
                    +"Race:\t"+ d.race); 
    
    $("#chart").append(event.target);
}

/**
 * Handle interactions when the mouse hovers out of a marker
 * @param {type} event
 * @param {type} d
 */
function handleMouseOut(event, d){
    if(d.gender == "M"){
        d3.select(event.target)
                .attr("r", 5)
                .style("opacity", 0.7);
    }else if(d.gender == "F"){
        d3.select(event.target)
                .attr("x", (d)=>{
                    return scaleX(new Date(d.date)) - DEFAULT_SIZE;})
                .attr("y", (d)=>{
                    return scaleY(d.state) - DEFAULT_SIZE;})
                .attr("width", (d)=>{
                    return DEFAULT_SIZE*2;})
                .attr("height", (d)=>{
                    return DEFAULT_SIZE*2;})
                .style("opacity", 0.7);
    }
    
    d3.select("#floater")
            .style("padding", "0px")
            .style("border-radius", "0px")
            .html(""); 
}

