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
    public static INCOMING = "bpmn:incoming";
    public static OUTGOING = "bpmn:outgoing";
    public static START_EVENT = "bpmn:startEvent";
    public static END_EVENT = "bpmn:endEvent";
    public static SEQUENCE_FLOW = "bpmn:sequenceFlow";

    public static ID = "id";
    
}

export interface Attribute{
    name: string;
    value: string;
    type: string;
    position: number;
}

export interface AttributeList{
    attributes: Attribute[]
    position: number;
}


export interface AttributeBCI {
    id:number
    type:string
    params:Map<string, any>
}
