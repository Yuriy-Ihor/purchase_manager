var purchaseNum=2;
var purchasesArr=['2019-04-05 T-shirt USD 45', '2019-04-26 Radio EUR 450']; //хтось тут слухає rammstein?:)
var listPurchases = purchasesArr.map((purchase) =>
  <li>{purchase}</li>
);

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={
			arr: listPurchases,
			currs: [],
			isLoaded: false,
			value: '',
		};
	}
	handleChange = (event) =>{
		this.setState({value: event.target.value});
	}
	handleSubmit = (event) => {
    	event.preventDefault();
  	}
	AddPurchase = () =>{
		let newPurchase=this.state.value;
		if(newPurchase){
			purchaseNum++;
			purchasesArr.push(newPurchase);
			purchasesArr.sort();
			listPurchases = purchasesArr.map((purchase) =>
 			 <li>{purchase}</li>
			);
			this.setState({arr: listPurchases});
			purchaseNum++;
			console.log("New purchase was added");
		}	
	}
	Convert = (curFrom, val1, curTo) =>{
		let rez=val1;;
		let keyArr = Object.keys(this.state.currs);
		let valArr = Object.values(this.state.currs);
   		let objSize = keyArr.length;
    	for (let i=0; i< objSize; i++){
    		if (curFrom == keyArr[i]){	
    			console.log('First currency was found');
    			rez = rez/valArr[i];
    			break;
    		}
    	}
    	for (let i=0; i< objSize; i++){
    		if (curTo == keyArr[i]){	
    			console.log('Second currency was found');
    			rez = rez*valArr[i];
    			break;
    		}
    	}
    	return rez;
	}	
	componentDidMount(){
		fetch('http://data.fixer.io/api/latest?access_key=711c8140a61b5a445bb3853ffad0d6e2')
		.then((Response) => Response.json())
		.then((findresponse) => 
		{
			this.setState({		
				isLoaded: true,
				currs: findresponse.rates,		
			})
			console.log(findresponse);
		});
		console.log("Data was succesfully loaded!");
	}
	ReportPurchase = () =>{
		let valSplit = this.state.value.split(' ');
		let yearToReport= valSplit[0];
		let currency = valSplit[1];
		if(yearToReport && currency){
			let tempArr;
			let sum=0;
			let tempVal;
			let curFrom;
			for(let i=0; i<purchasesArr.length; i++){
				tempArr=purchasesArr[i].split(' ');
				let tempArrDate=tempArr[0].split('-');
				if (tempArrDate[0]==yearToReport){	
					tempVal=parseInt(tempArr[3],10);
					curFrom = tempArr[2];
					if(curFrom!=currency){sum+=this.Convert(curFrom,tempVal,currency)}
					else{sum+=tempVal};
				}			
			}
		alert(sum);
		console.log("Income was succesfully reported!");
		}else{
			alert("You haven\'t written proper values");
		}	
	}
	DeletePurchase = () =>{
		let dateToClear = this.state.value;
		let tempArr;
		let deleted;
		for(let i=0; i<purchaseNum; i++){
			tempArr=purchasesArr[i].split(' ');
			if (tempArr[0]==dateToClear){
				purchasesArr.splice(i,1);
				listPurchases = purchasesArr.map((purchase) =>
 				 <li>{purchase}</li>
				);
				i--;
				this.setState({arr: listPurchases});
				deleted++;
				continue;
			}	
		}
		purchaseNum-=deleted;
		console.log("Purchase was removed!");
	}
	render(){
		return(
			<div>			
				<form onSubmit={this.handleSubmit}>     			
        			<div className="buttons">
        				<button type="submit" onClick={this.AddPurchase}>Add new purchase</button>
						<button type="submit" onClick={this.ReportPurchase}>Report</button>
						<button type="submit" onClick={this.DeletePurchase}>Delete purchase</button>
					</div>
					<label>
          				<input type="text" value={this.state.value} onChange={this.handleChange} />
        			</label>
      			</form>
				<ul>{this.state.arr}</ul>
			</div>
		);
	}
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);