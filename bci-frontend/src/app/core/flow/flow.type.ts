export interface Flow
{
    'bpmn:process': string ;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}

export class Constantes {
    public static DEFINITIONS = "bpmn:definitions";
    public static PROCESS = "bpmn:process";
    public static SEQUENCE = "bpmn:sequenceFlow";
    
}

export interface Attribute{
    name: string;
    value: string;
    type: string;
}
