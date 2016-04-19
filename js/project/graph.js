/**
* PredictGraph code start
*/
(function () {
	d3.PredictGraph = function() {
  	  // OPTIONS 
	  // (manipulated with getters and setters below)
	  var margin = {top: 50, right: 20, bottom: 100, left: 60},
		  width = getWidth($(window).width()),
		  height = 400,
		  xValue = function(d) { return d.date; },
		  yValue = function(d) { return d.actualvalue; },
		  yValue2= function(d) { return d.predictedvalue;},  
		  xScale = d3.time.scale().range([0, width]),
		  yScale = d3.scale.linear().range([height, 0]),
		  xAxis = xAxis = d3.svg.axis().scale(xScale)
			.orient("bottom").ticks(10).tickFormat(d3.time.format("%Y-%m-%d")), //this is where the date is formatted for the axis,
		  yAxis = d3.svg.axis().scale(yScale)
			.orient("left").ticks(10),
		  line = d3.svg.line().x(X).y(Y),
		  line_before= d3.svg.line()
		  		// .interpolate("basis")
				.x(function(d) { return xScale(d.date);})
				.y(function(d) { return yScale(d.actualvalue);
							}),
		  line_after= d3.svg.line()
		  		// .interpolate("basis")
				.x(function(d) { return xScale(d.date);})
				.y(function(d) { return yScale(d.predictedvalue);})
		  today= moment()._d, //date object
		  formatDate = d3.time.format("%Y-%m-%d"),
		  bisectDate = d3.bisector(function(d) { return d.date; }).left,
		  todayFormatted = formatDate(moment()._d),
		  alreadyClicked=false,
		  product = "product1";
	  
	  
	  function chart(selection) {
	  
	  	console.log(selection); //[Array[1]]  //div#graph1.svg-container
		
		selection.each(function(data) {
		//console.log(this);
		//console.log(d3.select(this));
		//console.log(d3.select(this)[0][0].id); //graph1
		
		var selectionNumber = d3.select(this)[0][0].id.slice(-1);
		
		
		//drawIndicatorBox(selectionNumber,product);

		
		
		var max_actual = d3.max(data, function(d) { return d.actualvalue;} ); //before
		var max_predicted = d3.max(data, function(d) { return d.predictedvalue;} ); //after
		var max = Math.max(max_actual, max_predicted); //overall
		var min_actual = d3.min(data, function(d) { return d.actualvalue;} ); //before
		var min_predicted = d3.min(data, function(d) { return d.predictedvalue;} ); //after
		var min = Math.min(min_actual, min_predicted);			  
		var parsedate = d3.time.format("%Y-%m-%d").parse;		
		
		
		// to convert date from a formated string into a date object
			data.forEach(function(d) {
				d.date = parsedate(d.date);
			});  			
		  
		  
		  // Update the x-scale.
		  xScale.domain(d3.extent(data, function(d) { return d.date; })).range([0, width- margin.left - margin.right]);
		  
		  // Update the y-scale.
		  yScale.domain([min,max]).range([height- margin.top - margin.bottom,0]);
		  
		
          
          // Select the svg element, if it exists.
		  var svg = d3.select(this).selectAll("svg").data([data]);

		 //Otherwise, create the skeletal chart.
		 svg.enter().append("svg").append("g");
		  
		  //console.log(svg);
		  // Update the outer dimensions.
		  svg.attr("width", width).attr("height", height);
		  
		  
		  // Update the inner dimensions.
		  var g = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");		
		  

		  
		  
		  //console.log(svg.select("#clip-before"+this.id));
          var currNode=this;				  
		  if(svg.select("#clip-before"+this.id)[0][0]!=null){		  	
		     svg.select("#clip-before"+this.id+" rect")
		     .transition().duration(400)
		     .attr("width", xScale(parsedate(today)))
			 .attr("height", height- margin.top - margin.bottom);
			 
			 svg.select("#clip-after"+this.id+" rect")
		     .transition().duration(400)
		     .attr("x", xScale(parsedate(today)))
		     .attr("width", width-xScale(parsedate(today)))
			 .attr("height", height- margin.top - margin.bottom);
		  	
		  	 svg.selectAll("path.line-after")
		  	 .data(data).transition()
             .duration(400).attr("d", line_after(data));
             
             svg.selectAll("path.line-before")
		  	 .data(data).transition()
             .duration(400).attr("d", line_before(data));
             
             svg.select("line.today")
		     .transition().duration(400)
		     .attr({'x1': xScale(parsedate(today)),'y1': 0,'x2': xScale(parsedate(today)),'y2': height- margin.top - margin.bottom})
				.style("stroke", "#000")
				.style("stroke-dasharray", ("3, 3"))
				.style("fill", "none");	  
			
			 svg.select(".xgrid").transition().duration(400).call(make_x_axis()
					.tickSize(-height+margin.top+margin.bottom, 0, 0)
					.tickFormat("")
				);

			 svg.select(".ygrid").transition().duration(400).call(make_y_axis()
					.tickSize(-width+margin.left+margin.right, 0, 0)
					.tickFormat("")
				);
			 
			  svg.select(".x.axis")
 				.attr("transform", "translate(0,250)").transition().duration(400).call(xAxis);     
 			  svg.select(".y.axis").transition().duration(400).call(yAxis);
 			  
 			  g.selectAll(".x.axis text")  // select all the text elements for the xaxis
			  	.attr("transform", function(d) {
				 return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
			 });		      
		  }else{
		  // Add the X Axis
		  g.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0,250)")
				.call(xAxis);
 		        
		  g.selectAll(".x.axis text")  // select all the text elements for the xaxis
			  .attr("transform", function(d) {
				 return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
			 });

		  // Add the Y Axis
		  g.append("g")
 				.attr("class", "y axis").call(yAxis)
			
		  
		  	// Draw the x Grid lines
			g.append("g")
				.attr("class", "xgrid")
				.attr("transform", "translate(0,250)");
			
			// Draw the y Grid lines
			g.append("g")            
				.attr("class", "ygrid");
			
			svg.select(".xgrid").call(make_x_axis()
					.tickSize(-height+margin.top+margin.bottom, 0, 0)
					.tickFormat("")
				)

			svg.select(".ygrid").call(make_y_axis()
					.tickSize(-width+margin.left+margin.right, 0, 0)
					.tickFormat("")
				)  
				
		  	g.append("clipPath")
				  .attr("id", "clip-before"+this.id)
				  .append("rect")
				  .attr("width", xScale(parsedate(today)))
				  .attr("height", height- margin.top - margin.bottom);
				  
			 g.append("clipPath")
				  .attr("id", "clip-after"+this.id)
				  .append("rect")
				  .attr("x", xScale(parsedate(today)))
				  .attr("width", width-xScale(parsedate(today)))
				  .attr("height", height- margin.top - margin.bottom);
				  
		  	g.selectAll(".line")
				  .data(["after"])
				  .enter().append("path")
				  .attr("class", function(d) { return "line-" + d; })
				  .attr("clip-path", function(d) { return "url(#clip-"+d+currNode.id+")"; })
				  .attr("d", line_after(data));
				  
			 g.selectAll(".line")
				  .data(["before"])
				  .enter().append("path")
				  .attr("class", function(d) { return "line-" + d; })
				  .attr("clip-path", function(d) { return "url(#clip-"+d+currNode.id+")"; })
				  .attr("d", line_before(data));
				  
			g.append("line")
				.attr("class","today")
				.attr({
					'x1': xScale(parsedate(today)),
					'y1': 0,
					'x2': xScale(parsedate(today)),
					'y2': height- margin.top - margin.bottom
				})
				.style("stroke", "#000")
				.style("stroke-dasharray", ("3, 3")) 
				.style("stroke-width","1.5px")
				.style("fill", "none");	

					
		  }
		  
		  
			

		
		var verticalLine =  g.append("g")
					.style("display", "none");
					
			verticalLine.append('line')
				.attr({
					'x1': 0,  
					'y1': 0,  
					'x2': 0,  
					'y2':height-margin.bottom-margin.top    // height-margin.bottom
				})
				.attr('class', 'verticalLine');



			//maybe can add id, or maybe add it within the if...else statement	  
		  
		  	var focus = g.append("g")
					.style("display", "none");
		
		
		
			// append the circle at the intersection          
			focus.append("circle")                                 
				.attr("class", "ycircle")                           
				.attr("r", 5);                                     

			// append the rectangle to capture mouse               
			g.append("rect")                                     
				.attr("width", width-margin.left-margin.right)                              
				.attr("height", height- margin.top - margin.bottom)  
				// .attr("transform", "translate(" + margin.left + "," + margin.top + ")")                          
				.style("fill", "none")                             
				.style("pointer-events", "all")                    
				.on("mouseover", function() { focus.style("display", null);
					verticalLine.style("display", null);	 })
				.on("mouseout", function() { focus.style("display", "none"); 
					verticalLine.style("display", "none"); })
				.on("mousemove", mousemove);                      


			function mousemove() {                                
				var x0 = xScale.invert(d3.mouse(this)[0]),            
					i = bisectDate(data, x0, 1),                   
					d0 = data[i - 1],                              
					d1 = data[i],                                  
					d = x0 - d0.date > d1.date - x0 ? d1 : d0;     

				//console.log(xScale(d.date));
				
				
				if(d.date<parsedate(today)){
					focus.select("circle.ycircle")// .transition().duration(400)                           
					.attr("transform", "translate(" + (xScale(d.date)) + "," + (yScale(d.actualvalue)) + ")")
					.style("fill", "#3498DB");
					verticalLine.select('line.verticalLine').attr('transform','translate('+xScale(d.date) + ",0)").attr("stroke", "#3498DB");
				}else{
					focus.select("circle.ycircle")                           
					.attr("transform","translate(" + (xScale(d.date)) + "," +(yScale(d.predictedvalue)) + ")")
					.style("fill","#FFB03B");
					verticalLine.select('line.verticalLine').attr('transform','translate('+xScale(d.date) + ",0)").attr("stroke", "#FFB03B");
				}
				
		  }


		  
		  
		  // function for the x grid lines
			function make_x_axis() {
				return d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.ticks(10);
			}

			// function for the y grid lines
			function make_y_axis() {
			  return d3.svg.axis()
				  .scale(yScale)
				  .orient("left")
				  .ticks(10);
			}
	

		  
		
	       alreadyClicked = true;
		});
	  }

	  // The x-accessor for the path generator; xScale ∘ xValue.
	  function X(d) {
		return xScale(formatDate.parse(d.date));
	  }

	  // The y-accessor for the path generator; yScale ∘ yValue.
	  function Y(d) {
		return yScale(d.actualvalue);
	  }
  
	  function Y2(d){
		return yScale(d.predictedvalue);
	  }

	  chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	  };

	  chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	  };

	  chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	  };

	  chart.x = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	  };

	  chart.y = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	  };
	  
	  chart.product = function(value) {
		if (!arguments.length) return product;
		product = value;
		return chart;
	  };
	  
	  
	  

	  
	  function getWidth(width){
	
			if (width > 1500 || width < 990) {
				return 800;
			}else if ( width > 1300 && width > 990){
				return 700;
			}else{
				return 650;
			}
		}  
	   return chart;
	};
})();
