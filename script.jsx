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
      item: 'Camera',
      date: 2019,
      fullDate: '2019-01-01',
      cur: 'UAH',
      price: '1240',
      showing: "start",
      report: 0,
    };
  }
  SetValue = (event) =>{
    this.setState({item: event.target.value});
  }
  SetDate = (event) =>{
    this.setState({date: event.target.value});
  }
  SetCur = (event) =>{
    this.setState({cur: event.target.value});
  }
  SetPrice = (event) =>{
    this.setState({price: event.target.value});
  }
  SetFulldate = (event) =>{
    this.setState({fullDate: event.target.value});
  }
  handleSubmit = (event) => {
      event.preventDefault();
    }
  StateReport =() =>{
      this.setState({showing: 'report'});
  }
  StateAdd =() =>{
    this.setState({showing: 'add'});
  }
  StateDelete =() =>{
    this.setState({showing: 'delete'});
  }
  AddPurchase = () =>{
    console.log(this.state.fullDate);
    console.log(this.state.item);
    console.log(this.state.cur);
    console.log(this.state.price);
    let newPrice = this.state.price.toString()
    let newPurchase=this.state.fullDate + ' ' + this.state.item + ' ' + this.state.cur + ' '+ newPrice;
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
    console.log(this.state.date);
    console.log(this.state.cur);
    console.log(this.state.fullDate);
    console.log(this.state.item);
    let date=this.state.date;
    console.log(date);
    date = date.toString();
    if(date && this.state.cur){
      let tempArr;
      let sum=0;
      let tempVal;
      let curFrom;
      for(let i=0; i<purchasesArr.length; i++){
        tempArr=purchasesArr[i].split(' ');
        let tempArrDate=tempArr[0].split('-');
        if (tempArrDate[0]==date){  
          tempVal=parseInt(tempArr[3],10);
          curFrom = tempArr[2];
          if(curFrom!=this.state.cur){sum+=this.Convert(curFrom,tempVal,this.state.cur)}
          else{sum+=tempVal};
        }     
      }
    this.setState({report:sum});
    console.log("Income was succesfully reported!");
    }else{
      alert("You haven\'t written proper values");
    } 
  }
  DeletePurchase = () =>{
    let tempArr;
    let deleted;
    for(let i=0; i<purchaseNum; i++){
      tempArr=purchasesArr[i].split(' ');
      if (tempArr[0]==this.state.fullDate){
        purchasesArr.splice(i,1);
        listPurchases = purchasesArr.map((purchase) =>
         <li>{purchase}</li>
        );
        i--;
        this.setState({arr: listPurchases});
        deleted++;
        console.log("Purchase was removed!");
        continue;
      } 
    }
    purchaseNum-=deleted;
  }
  
  render(){
    if(this.state.showing==='start')
      return(
        <div>     
          <form onSubmit={this.handleSubmit}>           
                <div className="buttons">
                  <button type="submit" onClick={this.StateAdd}>Add new purchase</button>
                  <button type="submit" onClick={this.StateReport}>Report</button>
                  <button type="submit" onClick={this.StateDelete}>Delete purchase</button>
            </div>
              </form>
          <ul>{this.state.arr}</ul>
        </div>
      );
    else
      if(this.state.showing === "report")
      return(
        <div>     
          <form onSubmit={this.handleSubmit}>           
                <div className="buttons">
                  <button type="submit" onClick={this.StateAdd}>Add new purchase</button>
                  <button type="submit" onClick={this.StateReport} className='active'>Report</button>
                  <button type="submit" onClick={this.StateDelete}>Delete purchase</button>
            </div>
            
                Report for 
                <input type="number" value={this.state.date} onChange={this.SetDate} />
                <input type="text" value={this.state.cur} onChange={this.SetCur} />
                <input type="submit" value='Report' onClick={this.ReportPurchase} />

                
                <div>Sum: {this.state.report} {this.state.cur}</div>
          </form>
          <ul>{this.state.arr}</ul>
        </div>
      );
    else
    if(this.state.showing === "add")
      return(
        <div>     
          <form onSubmit={this.handleSubmit}>           
                <div className="buttons">
                  <button type="submit" onClick={this.StateAdd} className='active'>Add new purchase</button>
                  <button type="submit" onClick={this.StateReport}>Report</button>
                  <button type="submit" onClick={this.StateDelete}>Delete purchase</button>
            </div>
           
                <input type="date" value={this.state.fullDate} onChange={this.SetFulldate} />
                <input type="text" value={this.state.item} onChange={this.SetValue} />
                <input type="text" value={this.state.cur} onChange={this.SetCur} />
                <input type="number" value={this.state.price} onChange={this.SetPrice} />
                <input type="submit" value='Add' onClick={this.AddPurchase} />
                
              </form>
          <ul>{this.state.arr}</ul>
        </div>
      );
    else
    if(this.state.showing === "delete")
      return(
        <div>     
          <form onSubmit={this.handleSubmit}>           
                <div className="buttons">
                  <button type="submit" onClick={this.StateAdd}>Add new purchase</button>
                  <button type="submit" onClick={this.StateReport}>Report</button>
                  <button type="submit" onClick={this.StateDelete} className='active'>Delete purchase</button>
            </div>
            
              <input type="date" value={this.state.fullDate} onChange={this.SetFulldate} />
              <input type="submit" value="Remove"  onClick={this.DeletePurchase} />
            
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