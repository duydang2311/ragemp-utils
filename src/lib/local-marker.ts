export interface LocalMarker {
    type: RageEnums.Markers;
    position: IVector3;
    destination: IVector3;
    rotation: IVector3;
    scale: IVector3;
    radius: number;
    color: RGBA;
    bobUpAndDown: boolean;
    faceCamera: boolean;
    rotate: boolean;
    textureDict: string | null;
    textureName: string | null;
    drawOnEnts: boolean;

    render(): void;
}

export class RageMpLocalMarker implements LocalMarker {
    #type: RageEnums.Markers;
    #position: IVector3;
    #destination: IVector3;
    #direction: IVector3;
    #rotation: IVector3;
    #scale: IVector3;
    #radius: number;
    #color: RGBA;
    #bobUpAndDown: boolean;
    #faceCamera: boolean;
    #rotate: boolean;
    #textureDict: string | null;
    #textureName: string | null;
    #drawOnEnts: boolean;

    constructor(
        type: RageEnums.Markers,
        position: IVector3,
        destination: IVector3,
        rotation: IVector3,
        scale: IVector3,
        radius: number,
        color: RGBA,
        bobUpAndDown: boolean = false,
        faceCamera: boolean = false,
        rotate: boolean = false,
        textureDict: string | null = null,
        textureName: string | null = null,
        drawOnEnts: boolean = false
    ) {
        this.#type = type;
        this.#position = position;
        this.#destination = destination;
        this.#rotation = rotation;
        this.#scale = scale;
        this.#radius = radius;
        this.#color = color;
        this.#bobUpAndDown = bobUpAndDown;
        this.#faceCamera = faceCamera;
        this.#rotate = rotate;
        this.#textureDict = textureDict;
        this.#textureName = textureName;
        this.#drawOnEnts = drawOnEnts;
        this.#direction = this.#getDirectionVector();
    }

    get type() {
        return this.#type;
    }

    get position() {
        return this.#position;
    }

    get destination() {
        return this.#destination;
    }

    get rotation() {
        return this.#rotation;
    }

    get scale() {
        return this.#scale;
    }

    get radius() {
        return this.#radius;
    }

    get color() {
        return this.#color;
    }

    get bobUpAndDown() {
        return this.#bobUpAndDown;
    }

    get faceCamera() {
        return this.#faceCamera;
    }

    get rotate() {
        return this.#rotate;
    }

    get textureDict() {
        return this.#textureDict;
    }

    get textureName() {
        return this.#textureName;
    }

    get drawOnEnts() {
        return this.#drawOnEnts;
    }

    set type(value: number) {
        this.#type = value;
    }

    set position(value: IVector3) {
        this.#position = value;
    }

    set destination(value: IVector3) {
        this.#destination = value;
        this.#direction = this.#getDirectionVector();
    }

    set rotation(value: IVector3) {
        this.#rotation = value;
    }

    set scale(value: IVector3) {
        this.#scale = value;
    }

    set radius(value: number) {
        this.#radius = value;
    }

    set color(value: RGBA) {
        this.#color = value;
    }

    set bobUpAndDown(value: boolean) {
        this.#bobUpAndDown = value;
    }

    set faceCamera(value: boolean) {
        this.#faceCamera = value;
    }

    set rotate(value: boolean) {
        this.#rotate = value;
    }

    set textureDict(value: string | null) {
        this.#textureDict = value;
    }

    set textureName(value: string | null) {
        this.#textureName = value;
    }

    set drawOnEnts(value: boolean) {
        this.#drawOnEnts = value;
    }

    render() {
        mp.game.graphics.drawMarker(
            this.#type,
            this.#position.x,
            this.#position.y,
            this.#position.z,
            this.#direction.x,
            this.#direction.y,
            this.#direction.z,
            this.#rotation.x,
            this.#rotation.y,
            this.#rotation.z,
            this.#scale.x,
            this.#scale.y,
            this.#scale.z,
            this.#color[0],
            this.#color[1],
            this.#color[2],
            this.#color[3],
            this.#bobUpAndDown,
            this.#faceCamera,
            2,
            this.#rotate,
            this.#textureDict,
            this.#textureName,
            this.#drawOnEnts
        );
    }

    #getDirectionVector() {
        return new mp.Vector3(
            this.#destination.x - this.#position.x,
            this.#destination.y - this.#position.y,
            this.#destination.z - this.#position.z
        );
    }
}
