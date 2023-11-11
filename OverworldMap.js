class OverworldMap {
    constructor(config) {
      this.overworld = null;
      this.gameObjects = config.gameObjects;
      this.cutsceneSpaces = config.cutsceneSpaces || {};
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;
  
      this.isCutscenePlaying = false;
    }
  
    drawLowerImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.lowerImage, 
        utils.withGrid(10.5) - cameraPerson.x, 
        utils.withGrid(6) - cameraPerson.y
        )
    }
  
    drawUpperImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.upperImage, 
        utils.withGrid(20) - cameraPerson.x, 
        utils.withGrid(20) - cameraPerson.y
      )
    } 
  
    // check for walls 
    isSpaceTaken(currentX, currentY, direction) {
      const {x,y} = utils.nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
    }
  
    // to change maps when go to a particular position 
    mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {
  
        let object = this.gameObjects[key];
        object.id = key;
  
        //TODO: determine if this object should actually mount
        object.mount(this);
  
      })
    }
  
    async startCutscene(events) {
      this.isCutscenePlaying = true;
  
      for (let i=0; i<events.length; i++) {
        const eventHandler = new OverworldEvent({
          event: events[i],
          map: this,
        })
        await eventHandler.init();
      }
  
      this.isCutscenePlaying = false;
  
      //Reset NPCs to do their idle behavior
      // Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }
   
  
    checkForActionCutscene() {
      const hero = this.gameObjects["hero"];
      const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
      });
      if (!this.isCutscenePlaying && match && match.talking.length) {
        
        console.log("Starting cutscene for:", match);
        this.startCutscene(match.talking[0].events)
      }
    }
  
    checkForFootstepCutscene() {
      const hero = this.gameObjects["hero"];
      const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
      if (!this.isCutscenePlaying && match) {
        this.startCutscene( match[0].events )
      }
    }
  
    addWall(x,y) {
      this.walls[`${x},${y}`] = true;
    }
    removeWall(x,y) {
      delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
      this.removeWall(wasX, wasY);
      const {x,y} = utils.nextPosition(wasX, wasY, direction);
      this.addWall(x,y);
    }
  
  }
  
  // maps and charecters 
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "a.png",
      upperSrc: "",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(28),
          y: utils.withGrid(28),
          src: "npc1.png",
        }),
      },
      walls: {
        [utils.asGridCoord(27,24)] : true,
        [utils.asGridCoord(26,24)] : true,
        [utils.asGridCoord(25,24)] : true,
        [utils.asGridCoord(25,25)] : true,
        [utils.asGridCoord(25,26)] : true,
        [utils.asGridCoord(25,27)] : true,
        [utils.asGridCoord(25,28)] : true,
        [utils.asGridCoord(25,29)] : true,
        [utils.asGridCoord(25,30)] : true,
        [utils.asGridCoord(29,24)] : true,
        [utils.asGridCoord(30,24)] : true,
        [utils.asGridCoord(31,24)] : true,
        [utils.asGridCoord(32,24)] : true,
        [utils.asGridCoord(32,25)] : true,
        [utils.asGridCoord(32,26)] : true,
        [utils.asGridCoord(32,27)] : true,
        [utils.asGridCoord(32,28)] : true,
        [utils.asGridCoord(32,29)] : true,
        [utils.asGridCoord(32,30)] : true,
        [utils.asGridCoord(31,30)] : true,
        [utils.asGridCoord(30,30)] : true,
        [utils.asGridCoord(29,30)] : true,
        [utils.asGridCoord(28,30)] : true,
        [utils.asGridCoord(27,30)] : true,
        [utils.asGridCoord(26,30)] : true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(28,24)]: [
          {
            events: [
              { type: "changeMap", map: "living_room" }
            ]
          }
        ]
      }
    },
  
    living_room: {
      lowerSrc: "living.png",
      upperSrc: "",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(6),
          y: utils.withGrid(19),
          src: "npc1.png",
        }),
        npcB: new Person({
          x: utils.withGrid(9),
          y: utils.withGrid(13),
          src: "npc3.png",
        }),
      },
      walls: {
          // table walls 
          [utils.asGridCoord(7,16)] : true,
          [utils.asGridCoord(6,16)] : true,
          [utils.asGridCoord(5,16)] : true,
          [utils.asGridCoord(8,16)] : true,
          [utils.asGridCoord(7,13)] : true,
          [utils.asGridCoord(6,13)] : true,
          [utils.asGridCoord(4,13)] : true,
          [utils.asGridCoord(5,15)] : true,
          [utils.asGridCoord(8,15)] : true,
          [utils.asGridCoord(8,14)] : true,
          [utils.asGridCoord(5,14)] : true,
  
          // normal walls 
          [utils.asGridCoord(0,13)] : true,
          [utils.asGridCoord(0,14)] : true,
          [utils.asGridCoord(0,15)] : true,
          [utils.asGridCoord(0,16)] : true,
          [utils.asGridCoord(0,17)] : true,
          [utils.asGridCoord(0,18)] : true,
          [utils.asGridCoord(0,19)] : true,
          [utils.asGridCoord(0,20)] : true,

          [utils.asGridCoord(1,20)] : true,
          [utils.asGridCoord(2,20)] : true,
          [utils.asGridCoord(3,20)] : true,
          [utils.asGridCoord(4,20)] : true,
          [utils.asGridCoord(5,20)] : true,
        //   [utils.asGridCoord(6,20)] : true,
          [utils.asGridCoord(7,20)] : true,
          [utils.asGridCoord(8,20)] : true,
          [utils.asGridCoord(9,20)] : true,
          [utils.asGridCoord(10,20)] : true,
          [utils.asGridCoord(11,20)] : true,
          [utils.asGridCoord(12,20)] : true,
          [utils.asGridCoord(13,20)] : true,

          [utils.asGridCoord(11,8)] : true,
          [utils.asGridCoord(10,8)] : true,
          [utils.asGridCoord(9,8)] : true,
          [utils.asGridCoord(8,8)] : true,
          [utils.asGridCoord(7,9)] : true,
          [utils.asGridCoord(6,9)] : true,
          [utils.asGridCoord(5,8)] : true,
          [utils.asGridCoord(4,8)] : true,
          [utils.asGridCoord(3,8)] : true,
          [utils.asGridCoord(2,8)] : true,
          [utils.asGridCoord(1,8)] : true,
        },
        cutsceneSpaces: {
          // kitchen 
          [utils.asGridCoord(12,9)]: [
            {
              events: [
                { type: "changeMap", map: "kitchen" }
              ]
            }
          ],
          [utils.asGridCoord(12,10)]: [
            {
              events: [
                { type: "changeMap", map: "kitchen" }
              ]
            }
          ],
          [utils.asGridCoord(12,11)]: [
            {
              events: [
                { type: "changeMap", map: "kitchen" }
              ]
            }
          ],
          [utils.asGridCoord(12,12)]: [
            {
              events: [
                { type: "changeMap", map: "kitchen" }
              ]
            }
          ],
          // jail 
          [utils.asGridCoord(9,17)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ],
          [utils.asGridCoord(9,18)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ],
          [utils.asGridCoord(9,19)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ],
          [utils.asGridCoord(10,13)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ],
          [utils.asGridCoord(11,13)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ],
          // bed room 
          [utils.asGridCoord(0,9)]: [
            {
              events: [
                { type: "changeMap", map: "bed_room" }
              ]
            }
          ],
          [utils.asGridCoord(0,10)]: [
            {
              events: [
                { type: "changeMap", map: "bed_room" }
              ]
            }
          ],
          [utils.asGridCoord(0,11)]: [
            {
              events: [
                { type: "changeMap", map: "bed_room" }
              ]
            }
          ],
          [utils.asGridCoord(0,12)]: [
            {
              events: [
                { type: "changeMap", map: "bed_room" }
              ]
            }
          ],
        //   back outside 
        [utils.asGridCoord(6,20)]: [
            {
              events: [
                { type: "changeMap", map: "DemoRoom" }
              ]
            }
          ]
        }
    },
    kitchen: {
      lowerSrc: "kitchen.png",
      upperSrc: "",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(0),
          y: utils.withGrid(6),
          src: "npc1.png",
        }),
        erio: new Person({
          x: utils.withGrid(2),
          y: utils.withGrid(7),
          src: "erio.png",
        }),
        npc4: new Person({
          x: utils.withGrid(5),
          y: utils.withGrid(6),
          src: "npc4.png",
        }),
      },
      walls: {
          [utils.asGridCoord(0,7)] : true,
          [utils.asGridCoord(0,5)] : true,
          [utils.asGridCoord(-1,6)] : true,
        },
        cutsceneSpaces: {
          [utils.asGridCoord(1,6)]: [
            {
              events: [
                { type: "changeMap", map: "jail" }
              ]
            }
          ]
        },
    },
    jail: {
      lowerSrc: "jail.png",
      upperSrc: "nm.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(16),
          y: utils.withGrid(17),
          src: "npc1.png",
        }),
      },
      walls: {
          [utils.asGridCoord(16,18)] : true,
          [utils.asGridCoord(16,16)] : true,
          [utils.asGridCoord(17,17)] : true,
          [utils.asGridCoord(15,17)] : true,
        },
    },
    bed_room: {
      lowerSrc: "bed-room.png",
      upperSrc: "",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(11),
          y: utils.withGrid(7),
          src: "npc1.png",
        }),
      },
      walls: {
          [utils.asGridCoord(11,9)] : true,
          [utils.asGridCoord(10,9)] : true,
          [utils.asGridCoord(9,9)] : true,
          [utils.asGridCoord(8,9)] : true,
          [utils.asGridCoord(7,9)] : true,
          [utils.asGridCoord(6,9)] : true,
          [utils.asGridCoord(5,9)] : true,
          [utils.asGridCoord(4,9)] : true,
          [utils.asGridCoord(3,9)] : true,
          [utils.asGridCoord(2,9)] : true,
          [utils.asGridCoord(1,9)] : true,
  
          [utils.asGridCoord(1,9)] : true,
          [utils.asGridCoord(1,8)] : true,
          [utils.asGridCoord(1,7)] : true,
          [utils.asGridCoord(1,6)] : true,
          [utils.asGridCoord(1,5)] : true,
          [utils.asGridCoord(1,4)] : true,
  
          [utils.asGridCoord(1,4)] : true,
          [utils.asGridCoord(2,4)] : true,
          [utils.asGridCoord(3,4)] : true,
          [utils.asGridCoord(4,4)] : true,
          [utils.asGridCoord(5,4)] : true,
          [utils.asGridCoord(6,4)] : true,
          [utils.asGridCoord(7,4)] : true,
          [utils.asGridCoord(8,4)] : true,
          [utils.asGridCoord(11,4)] : true,

          [utils.asGridCoord(12,4)] : true,
          [utils.asGridCoord(12,5)] : true,
          [utils.asGridCoord(12,6)] : true,
          [utils.asGridCoord(12,8)] : true,
          [utils.asGridCoord(12,9)] : true,
          [utils.asGridCoord(12,10)] : true,
  
      //     [utils.asGridCoord(17,17)] : true,
      //     [utils.asGridCoord(15,17)] : true,
        },
        cutsceneSpaces: {
          [utils.asGridCoord(10,4)]: [
            {
              events: [
                { type: "changeMap", map: "winner_land" }
              ]
            }
          ],
          [utils.asGridCoord(9,4)]: [
            {
              events: [
                { type: "changeMap", map: "winner_land" }
              ]
            }
          ],
          [utils.asGridCoord(12,7)]: [
            {
              events: [
                { type: "changeMap", map: "living_room" }
              ]
            }
          ],
        },
    },
    winner_land: {
      lowerSrc: "ccc.png",
      upperSrc: "yw.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(16),
          y: utils.withGrid(17),
          src: "npc1.png",
        }),
      },
      walls: {
          [utils.asGridCoord(16,18)] : true,
          [utils.asGridCoord(16,16)] : true,
          [utils.asGridCoord(17,17)] : true,
          [utils.asGridCoord(15,17)] : true,
        },
    },
  }
  
  // C40000