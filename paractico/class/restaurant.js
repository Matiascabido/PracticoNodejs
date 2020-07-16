const cache = require('memory-cache');



class Restaurant {

  constructor(name = '', kindOfRestaurant = '', specials = []){
    this.name = name
    this.kindOfRestaurant = kindOfRestaurant
    this.specials = specials
  }  


  saveRestaurant(){
    let flag = false
    if(this.name  && this.kindOfRestaurant && this.specials.length > 0 ){

      if(!cache.get(this.name) ){ 
        cache.put( this.name, {
        'name' : this.name,
        'kindOfRestaurant': this.kindOfRestaurant,
        'specials': this.specials
        })
        flag = true
      }else flag = false
    }

    return flag
    
  }

  getRestaurant(){

  }

}


module.exports = Restaurant