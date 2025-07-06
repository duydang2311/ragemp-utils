export type EntityType =
    | 'blip'
    | 'checkpoint'
    | 'colshape'
    | 'dummy'
    | 'marker'
    | 'object'
    | 'pickup'
    | 'player'
    | 'vehicle'
    | 'ped'
    | 'textlabel';

export interface Vector2 {
    x: number;
    y: number;
}

export interface Vector3 extends Vector2 {
    z: number;
}

export interface StreamedMetaSchema {}
