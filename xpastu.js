var tableID = "mojeTabulka";

var customBG = '#2ff';//undefined;
var customCOLOR = undefined;//'#555';

var sourceColumn;
var tdV;
var tdH;
var startOffsetV;
var startOffsetH;
	
//Class for column TDs with info
function TableColumn(span, count) {
	this.span = span;
	this.count = count;
	
	this.data = [];
	this.getData = function() { return this.data; };
	this.getDataLength = function() { return this.data.length; };
	this.addData = function(item) { this.data[this.data.length] = item; };
	
	this.getSpan = function() { return this.span; };
	this.getCount = function() { return this.count;	};
}
	
window.onload = function(){
(function () {

	///////////////////////////////////////////////////
	/////////////		Movable			///////////////
	///////////////////////////////////////////////////

	//Function exchange two TD cells
	function swapCells (left, right) {
		var temp = right.innerHTML;
		right.innerHTML = left.innerHTML;
		left.innerHTML = temp;
		
		var temp = right.style.width
		right.style.width = left.style.width;
		left.style.width = temp;
		
		var temp = right.style.height
		right.style.height = left.style.height;
		left.style.height = temp;
	}
	
	//Function swap two columns of the table
	function swapColumns (myFirst, mySecond) {
		var cell;
		var isDragAllowed = true;
		var leftColumn;
		var rightColumn;
		var leftColSpan = 1;
		var rightColSpan = 1;
		var leftColId = 0;
		var rightColId = 0;
		var hasTH = false;
		
		var trs = document.getElementById(tableID).querySelectorAll("tr");
		for (var j = 0, jlen = trs.length; j < jlen; j++) {
			var tr = trs[j];
			
			var indexLeft = 0;
			var indexRight = 0;
			var indexLeftWithSpan = 0;
			var indexRightWithSpan = 0;
			var tdLMaxId = 0;
			var tdRMaxId = 0;

			if ( tr.getElementsByTagName('td').length !== 0 ) {
				cell = 'td';
				
				if ( !hasTH ) { 
					alert('Table has not contain any TH cell');
					return false;
				}
			}
			if ( tr.getElementsByTagName('th').length !== 0 ) {
				cell = 'th';
				
				if ( j === 0 ) {
					hasTH = true;
					
					var ths = tr.getElementsByTagName(cell);
					for (var i = 0, len = ths.length; i < len; i++) {
						if ( myFirst > i ) {
							leftColId += ths[i].colSpan;
						}
						if ( mySecond > i ) {
							rightColId += ths[i].colSpan;
						}
						
						if ( myFirst == i ) {
							leftColSpan = ths[i].colSpan;
						}
						if ( mySecond == i ) {
							rightColSpan = ths[i].colSpan;
						}
					}
					
					leftColumn = new TableColumn(leftColSpan, trs.length);
					rightColumn = new TableColumn(rightColSpan, trs.length);
				}
			}
			
			var tds = tr.getElementsByTagName(cell);
			for (var k = 0, klen = tds.length; k < klen; k++) {
				var td = tds[k];
				
				if ( indexLeftWithSpan < leftColId ) {
					indexLeftWithSpan += td.colSpan;
					indexLeft++;
				}
				if ( indexRightWithSpan < rightColId ) {
					indexRightWithSpan += td.colSpan;
					indexRight++;
				}
			}

			if ( (indexLeft+1) > tds.length || tds[indexLeft].colSpan > leftColSpan || 
					(indexRight+1) > tds.length || tds[indexRight].colSpan > rightColSpan ) {
				isDragAllowed = false;
				break;
			}
			
			for (var k = 0; k < leftColSpan; k++) {
				leftColumn.addData(tds[indexLeft+k]);
			}
			for (var k = 0; k < rightColSpan; k++) {
				rightColumn.addData(tds[indexRight+k]);
			}		
		}
		
		console.log("Drag allowed: " + isDragAllowed);
		//console.log("Left ID: " + leftColId);
		console.log("Right ID: " + rightColId);
		console.log("Left span: " + leftColSpan);
		console.log("Right span: " + rightColSpan);
		
		if ( isDragAllowed ) {
			var left = leftColumn.getData();
			var right = rightColumn.getData();
			
		/*	console.debug(leftColumn);
			console.debug(rightColumn);*/
			
			var len = trs.length;
			
			//Columns have same span
			if ( left.length == right.length ) {
				for (var i = 0; i < len; i++) {
					swapCells(left[i], right[i]);
				}
			}
			else if ( left.length > right.length ) {
				var rightSpan = rightColumn.getSpan();
				var leftSpan = leftColumn.getSpan();

				var tmp = trs[0].getElementsByTagName('th');
				tmp[myFirst].colSpan = rightColSpan;
				tmp[mySecond].colSpan = leftColSpan;
						
				swapCells(left[0], right[0]);

				for (var i = 1; i < len; i++) {
					for (var j = 0, jlen = leftSpan; j < jlen; j++) {
						if ( j >= rightSpan ) {
							var cell = trs[i].insertCell(j+rightColId);
							cellFill(cell,left[i*leftSpan+j]);
							trs[i].deleteCell(j+leftColId);
						}
						else {
							swapCells(left[i*leftSpan+j], right[i*rightSpan+j]);
						}
					}
				}
			}
			else {
				var rightSpan = rightColumn.getSpan();
				var leftSpan = leftColumn.getSpan();
				
				var tmp = trs[0].getElementsByTagName('th');
				tmp[myFirst].colSpan = rightColSpan;
				tmp[mySecond].colSpan = leftColSpan;
						
				swapCells(left[0], right[0]);
				
				for (var i = 1; i < len; i++) {
					for (var j = 0, jlen = rightSpan; j < jlen; j++) {
						if ( j >= leftSpan ) {
							trs[i].deleteCell(j+rightColId);
							var cell = trs[i].insertCell(j+leftColId);
							cellFill(cell,right[i*rightSpan+j]);
						}
						else {
							swapCells(left[i*leftSpan+j], right[i*rightSpan+j]);
						}
					}
				}
			}
		}
		else {
			alert('Drag&Drop is NOT allowed because of colspan of any TD cell is bigger than colspan of TH cell');
		}
	}

	//Auxiliary function for copy cell
	function cellFill (cell, filling) {
		cell.innerHTML = filling.innerHTML;
		cell.style.width = filling.style.width;
		cell.style.height = filling.style.height;
	}
	
	///////////////////////////////////////////////////
	/////////////		Drag & Drop		///////////////
	///////////////////////////////////////////////////
	
	//Allow Drop
	function allowDrop(ev) {
		ev.preventDefault();
	}

	//Set Drag data send
	function drag(ev) {
		//Must be here BO any bug in Mozilla
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
			ev.dataTransfer.setData("text", ev.target.cellIndex);
		}
		
		//Not to be sended but save to global variable
		sourceColumn = ev.target.cellIndex;
	}

	//Set Drop data get plus processing
	function drop(ev) {
		ev.preventDefault();
		
		var index = ev.target.cellIndex;
		var sourceIndex = sourceColumn;
		sourceColumn = undefined;
		
		console.log("Source cell index: " + sourceIndex);
		console.log("Dest cell index: " + index);
		
		//Same column for Drag and Drop
		if ( index === sourceIndex ) {
			return false;
		}
		else if ( index > sourceIndex ) {
			var temp = index;
			index = sourceIndex;
			sourceIndex = temp;
		}

		swapColumns(index, sourceIndex);
		
		Array.prototype.forEach.call(
			document.getElementById(tableID).getElementsByClassName("fillerV"),
			function(div) {
				div.addEventListener('mousedown', function(e) {
					tdV = div.parentElement;
					startOffsetV = tdV.offsetWidth - e.pageX;
				})
				div.parentElement.style.position = 'relative';;
			}
		);
		
		Array.prototype.forEach.call(
			document.getElementById(tableID).getElementsByClassName("fillerH"),
			function(div) {
				div.addEventListener('mousedown', function(e) {
					tdH = div.parentElement;
					startOffsetH = tdH.offsetHeight - e.pageY;
				})
			}
		);
	}

	///////////////////////////////////////////////////
	/////////////		INIT section	///////////////
	///////////////////////////////////////////////////

	//Make all TH cell draggable
	var tableRows = document.getElementById(tableID).querySelectorAll("tr");
	for (var i = 0, len = tableRows.length; i < len; i++) {
		var ths = tableRows[i].querySelectorAll("th");
		
		if ( ths.length == 0 ) { continue; }
		
		for (var j = 0, jlen = ths.length; j < jlen; j++) {
			var th = ths[j];

			if ( customBG !== undefined ) { th.style.backgroundColor = customBG; }
			if ( customCOLOR !== undefined ) { th.style.color = customCOLOR; }
			
			th.setAttribute('draggable', true);
			th.style.cursor = 'move';
			
			th.addEventListener('drop', drop);
			th.addEventListener('dragstart', drag);
			th.addEventListener('dragover', allowDrop);
		}
		
		//Only first row of THs can be draggable
		break;
	}
	
	////////////////////////////////////////////////////////////
	
	//Make all TD cell resizable
/*	var tableTds = document.getElementById(tableID).querySelectorAll("td");
	for (var i = 0, len = tableTds.length; i < len; i++) {
		var td = tableTds[i];*/
	Array.prototype.forEach.call(
		document.getElementById(tableID).querySelectorAll("td"),
		function(td) {	
		td.style.position = 'relative';

		//Create vertical strip to be selected to resize width
		var fillerV = document.createElement('div');
		fillerV.innerHTML = '&nbsp;';
		fillerV.className = 'fillerV';
		fillerV.style.position = 'absolute';
		fillerV.style.top = 0;
		fillerV.style.right = 0;
		fillerV.style.bottom = 0;
		fillerV.style.width = '5px';
		fillerV.style.cursor = 'col-resize';

		//Create horizontal strip to be selected to resize height
		var fillerH = document.createElement('div');
		fillerH.innerHTML = '&nbsp;';
		fillerH.className = 'fillerH';
		fillerH.style.position = 'absolute';
		fillerH.style.right = 0;
		fillerH.style.bottom = 0;
		fillerH.style.left = 0;
		fillerH.style.height = '5px';
		fillerH.style.cursor = 'row-resize';

		//Take into account real cell index despite of colspan
		/*var actIndex = 0;
		
		var tr = td.parentElement.querySelectorAll("td");
		for (var j = 0, jlen = tr.length; j < jlen; j++) {
			var thisTd = tr[j];
			
			if ( td.cellIndex == thisTd.cellIndex )
			{
				break;
			}
			
			actIndex += td.colSpan;
		}*/
		
		fillerV.addEventListener('mousedown', function(e) {
			tdV = td;
		//	tdV.cellIndex = actIndex;
			startOffsetV = td.offsetWidth - e.pageX;
		});

		fillerH.addEventListener('mousedown', function(e) {
			tdH = td;
			startOffsetH = td.offsetHeight - e.pageY;
		});

		//Append strips to cell
		td.appendChild(fillerV);
		td.appendChild(fillerH);
	}
	);
			
	///////////////////////////////////////////////////
	/////////////		Resizable		///////////////
	///////////////////////////////////////////////////
	
	//On mouse move if is clicked resize change width(height) appropriatelly
	document.addEventListener('mousemove', function(e) {
		if (tdV) {
			tdV.style.width = startOffsetV + e.pageX + 'px';
			
			var cell;
			var index = tdV.cellIndex;
			
			console.log(tdV.cellIndex);
			
			var trs = tdV.parentElement.parentElement.getElementsByTagName('tr');
			for (var i = 0, len = trs.length; i < len; i++) {
				var tr = trs[i];
				
				var actIndex = -1;
				
				if ( tr.getElementsByTagName('td').length !== 0 ) {
					cell = 'td';
				}
				if ( tr.getElementsByTagName('th').length !== 0 ) {
					cell = 'th';
				}
				
				var tds = tr.getElementsByTagName(cell);
				for (var j = 0, jlen = tds.length; j < jlen; j++) {
					td = tds[j];
					
					actIndex += td.colSpan;
					
					if ( actIndex >= index ) {
						console.log(i +" " + j);
						td.style.width = tdV.style.width;
						break;
					}
				}
			}
		}
		if (tdH) {
			tdH.style.height = startOffsetH + e.pageY + 'px';
			
			var tds = tdH.parentElement.getElementsByTagName('td');
			for (var i = 0, len = tds.length; i < len; i++) {
				var td = tds[i];
			
				td.style.height = tdH.style.height;
			}
		}
	});
	
	//On mouse up dont track mouse move
	document.addEventListener('mouseup', function(e) {
		tdV = undefined;
		tdH = undefined;
	});
})();
}

