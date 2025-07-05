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

export interface StreamedMetaSchema {}
