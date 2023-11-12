class OverworldEvent {
    constructor({ map, event}) {
      this.map = map;
      this.event = event;
    }
  
    textMessage(resolve) {
  
      const message = new TextMessage({
        text: this.event.text,
        onComplete: () => resolve()
      })
      message.init( document.querySelector(".game-container") )
    }
  
    // for changing maps 
    changeMap(resolve) {
  
      const sceneTransition = new SceneTransition();
      sceneTransition.init(document.querySelector(".game-container"), () => {
        this.map.overworld.startMap( window.OverworldMaps[this.event.map] );
        resolve();
  
        sceneTransition.fadeOut();
  
      })
    }
  
    // to starts events 
    init() {
      return new Promise(resolve => {
        this[this.event.type](resolve)      
      })
    }
  
  }