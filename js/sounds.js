

export default class Sounds {
    bank = {};
    constructor() {
        //Howler.pos(this.x, this.y, -0.5);
        this.bank.look = new Howl({
            src: ['../assets/audio/sounds.mp3'],
            // sprite: {
            //   lightning: [2000, 4147],
            //   rain: [8000, 9962, true],
            //   thunder: [19000, 13858],
            //   music: [34000, 31994, true]
            // },
            // volume: 0
        });
    }
    
    listenerPos(x, y) {
        Howl.pos(x, y, 0);
    }
}

