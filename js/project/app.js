//////////////////////////////////////////////////////////////////////////
// Entry point of application
//////////////////////////////////////////////////////////////////////////	
		

		
		
		var chart = d3.PredictGraph();
		//var chart2 = d3.PredictGraph().alreadyClicked(false);
		

		
		//Global Variables
		
		var formatDate = d3.time.format("%Y-%m-%d");
		
		var today = formatDate(moment()._d) || "2016-01-01";

		var first_day1 = formatDate(getFirstDay()) || "2015-01-01";
		
		var numMonths1 = "three";  //one, three, six, twelve
		
		var last_day1 = formatDate(getLastDay(numMonths1)) || "2016-04-01";
		
		var first_day2 = formatDate(getFirstDay()) || "2015-01-01";
		
		var numMonths2 = "three";  //one, three, six, twelve
		
		var last_day2 = formatDate(getLastDay(numMonths2)) || "2016-04-01";

		var product1 = "product1"; //to store selected product for graph1
		
		var product2 = "product1"; //to store selected product for graph2
		
		var loaded = false;
		
		

		// called everytime a user clicks on a month button or select a dropdown menu item
		// input params: the firstDay (today minus 12 months), lastDay (pass value retrieved from numMonths into getLastDay)
		// 				 productSelected (selected product based on dropdown menu value)
		function updateResults(firstDay, lastDay, productSelected){
		
			//get data... will get from Django eventually instead of json file
			d3.json("data/data.json",function(data){
				if(loaded){
				
				}else{
					loadDropdown(data);
					loaded=true;
				}
				
				// get data between first and last day and for the selected product
				// draw a single line as a test
				var test_data = data.filter(function(el){
					return el.date < lastDay && el.date > firstDay && el.productname == productSelected
				});
			    
			    chart.product(productSelected);
			
				d3.select("#graph1").datum(test_data).call(chart);
				
				
			});
		}
		
		function updateResults2(firstDay, lastDay, productSelected){
		
			//get data... will get from Django eventually instead of json file
			d3.json("data/data.json",function(data){
				if(loaded){
				
				}else{
					loadDropdown(data);
					loaded=true;
				}
				
				
				// get data between first and last day and for the selected product
				// draw a single line as a test
				var test_data = data.filter(function(el){
					return el.date < lastDay && el.date > firstDay && el.productname == productSelected
				});
			
			
				chart.product(productSelected);
				d3.select("#graph2").datum(test_data).call(chart);
				
				
			});
		}


		$(document).ready(function(){

			$('select#product-select1').on('change',function(){
				product1 = $('#product-select1').find(":selected").text();
				updateResults(first_day1,last_day1,product1);
				
			});
		
			$("#button30").click( function(){
				$(".buttons1").removeClass("selected-button");
				$("#button30").addClass("selected-button");
				numMonths1= $("#button30").data('months'); //or .data()
				first_day1=formatDate(getFirstDay());
				last_day1=formatDate(getLastDay(numMonths1));  // to set last day
				updateResults(first_day1,last_day1,product1);
			});
			
			$("#button90").click( function(){
				$(".buttons1").removeClass("selected-button");
				$("#button90").addClass("selected-button");
				numMonths1= $("#button90").data('months'); //or .data()
				first_day1=formatDate(getFirstDay());
				last_day1=formatDate(getLastDay(numMonths1));  // to set last day
				updateResults(first_day1,last_day1,product1);
			});
			
			$("#button180").click( function(){
				$(".buttons1").removeClass("selected-button");
				$("#button180").addClass("selected-button");
				numMonths1= $("#button180").data('months'); //or .data()
				first_day1=formatDate(getFirstDay());
				last_day1=formatDate(getLastDay(numMonths1));  // to set last day
				updateResults(first_day1,last_day1,product1);
			});
			
			$("#button360").click( function(){
				$(".buttons1").removeClass("selected-button");
				$("#button360").addClass("selected-button");
				numMonths1= $("#button360").data('months'); //or .data()
				first_day1=formatDate(getFirstDay());
				last_day1=formatDate(getLastDay(numMonths1));  // to set last day
				updateResults(first_day1,last_day1,product1);
			});
			
			updateResults(first_day1,last_day1,product1);
			

			
			$('select#product-select2').on('change',function(){
				product2 = $('#product-select2').find(":selected").text();
				updateResults2(first_day2,last_day2,product2);
				
			});
		
			$("#button30-2").click( function(){
				$(".buttons2").removeClass("selected-button");
				$("#button30-2").addClass("selected-button");
				numMonths2= $("#button30-2").data('months'); //or .data()
				first_day2=formatDate(getFirstDay());
				last_day2=formatDate(getLastDay(numMonths2));  // to set last day
				updateResults2(first_day2,last_day2,product2);
			});
			
			$("#button90-2").click( function(){
				$(".buttons2").removeClass("selected-button");
				$("#button90-2").addClass("selected-button");
				numMonths2= $("#button90-2").data('months'); //or .data()
				first_day2=formatDate(getFirstDay());
				last_day2=formatDate(getLastDay(numMonths2));  // to set last day
				updateResults2(first_day2,last_day2,product2);
			});
			
			$("#button180-2").click( function(){
				$(".buttons2").removeClass("selected-button");
				$("#button180-2").addClass("selected-button");
				numMonths2= $("#button180-2").data('months'); //or .data()
				first_day2=formatDate(getFirstDay());
				last_day2=formatDate(getLastDay(numMonths2));  // to set last day
				updateResults2(first_day2,last_day2,product2);
			});
			
			$("#button360-2").click( function(){
				$(".buttons2").removeClass("selected-button");
				$("#button360-2").addClass("selected-button");
				numMonths2= $("#button360-2").data('months'); //or .data()
				first_day2=formatDate(getFirstDay());
				last_day2=formatDate(getLastDay(numMonths2));  // to set last day
				updateResults2(first_day2,last_day2,product2);
			});
			
			updateResults2(first_day2,last_day2,product2);

   		});
   		
   		
   		


			// function to set last day date... basically today + 1, 3, 6, or 12 months, default is 3
			function getLastDay(months){ 

				switch(months){
					case "one": 
				
						return moment().add(1, 'months')._d; 
					break;
					case"six": 
				
						return moment().add(6, 'months')._d; 
					break;
					case"twelve":  
					
						return moment().add(12, 'months')._d; 
					break; 
					default: 
						return moment().add(3, 'months')._d; 
				};

			}
			
			// function to set first day date... basically today - 12
			function getFirstDay(){
				return moment().subtract(12,'months')._d;
			}
			
			
			function loadDropdown(data){
	
				var products=[];
	
				for(var i=0; i<data.length;i++){
						//use _.contains to make the prodcut unique	
			
						if(!_.contains(products, data[i].productname)){
						  $('#product-select1').append(
							$('<option></option>').val(data[i].productname).html(data[i].productname)
						  );
						  
						   $('#product-select2').append(
							$('<option></option>').val(data[i].productname).html(data[i].productname)
						  );
							products.push(data[i].productname);
						}			   
					}
		
			}

